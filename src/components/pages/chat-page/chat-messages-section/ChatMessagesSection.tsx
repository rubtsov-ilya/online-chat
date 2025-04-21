import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import useMessagesFromRtk from 'src/hooks/useMessagesFromRtk';
import styles from './ChatMessagesSection.module.scss';
import ToBottomBtn from 'src/components/ui/to-bottom-btn/ToBottomBtn';
import {
  addMessages,
  clearMessages,
} from 'src/redux/slices/MessagesArraySlice';
import { useDispatch } from 'react-redux';
import { IMessage } from 'src/interfaces/Message.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import useAuth from 'src/hooks/useAuth';
import MessageDateGroup from './message-date-group/MessageDateGroup';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';

import {
  ref as refFirebaseDatabase,
  onValue,
  get,
  query,
  limitToFirst,
  orderByKey,
  limitToLast,
  startAt,
  endBefore,
  update,
  equalTo,
  orderByChild,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import {
  CIRCULAR_LOADING_PERCENT_VALUE,
  MESSAGES_LOAD_COUNT,
  SCROLL_ANIMATION_LENGTH,
  SCROLL_COEFFICIENT,
} from 'src/constants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface ChatMessagesSectionProps {
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  activeChatId: string | null;
  isSubscribeLoading: boolean;
  duringMessageSendingToggle: boolean;
  isChatExist: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({
  isMobileScreen,
  uploadTasksRef,
  activeChatId,
  isSubscribeLoading,
  duringMessageSendingToggle,
  isChatExist,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  /* const [messagesArray, setMessagesArray] = useState([]); */
  const { uid } = useAuth();
  const { messagesArray } = useMessagesFromRtk();
  const endRef = useRef<HTMLDivElement>(null);
  const beforeMessagesObserverRef = useRef<HTMLDivElement>(null);
  const afterMessagesObserverRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const prevScrollStateRef = useRef<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }>({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 });
  const observerElements = useRef<Set<Element>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUnreadMessageLoading, setIsUnreadMessageLoading] =
    useState<boolean>(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(true);

  const [forceBottomScroll, setForceBottomScroll] = useState<boolean>(false);
  const [isSubscribeChanged, setIsSubscribeChanged] = useState<boolean>(false);
  const [isSubscribeChangedScrollLocked, setIsSubscribeChangedScrollLocked] =
    useState<boolean>(false);

  const [lastChangedCounter, setLastChangedCounter] = useState<'before' | null>(
    null,
  );
  const [debouncerToggle, setDebouncerToggle] = useState<boolean>(false);
  const [beforeScrollTrigger, setBeforeScrollTrigger] = useState<{
    toggle: boolean;
    locked: boolean;
  }>({
    toggle: false,
    locked: false,
  });
  const [subscribeControl, setSubscribeControl] = useState<{
    isDualSubscribe: boolean;
    firstUnreadMessageId: string;
  }>({
    isDualSubscribe: false,
    firstUnreadMessageId: '',
  });
  const [observerLocked, setObserverLocked] = useState<{
    isObserverBeforeLocked: boolean;
    isObserverAfterLocked: boolean;
  }>({
    isObserverBeforeLocked: false,
    isObserverAfterLocked: false,
  });
  const [observerCounts, setObserverCounts] = useState<{
    beforeCount: number;
    afterCount: number;
  }>({ beforeCount: 0, afterCount: 0 });
  const [messagesToMarkAsChecked, setMessagesToMarkAsChecked] = useState<
    IMessage[]
  >([]);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // сбросить все стейты при смене чат айди
    setBeforeScrollTrigger({ toggle: false, locked: false });
    setObserverCounts({ beforeCount: 0, afterCount: 0 });
    setObserverLocked({
      isObserverBeforeLocked: false,
      isObserverAfterLocked: false,
    });
    setDebouncerToggle(false);
    setLastChangedCounter(null);
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId || !uid) return;

    const observerOptions = {
      root: chatMessagesRef.current,
      rootMargin: '0px',
      threshold: 0.3, // 30% видимости сообщения
    };

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      const newMessagesToMark = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => {
          const messageElement = entry.target as HTMLElement;
          const messageId = messageElement.id;
          return messagesArray.find((msg) => msg.messageId === messageId);
        })
        .filter(
          (msg): msg is IMessage =>
            msg !== undefined && msg.senderUid !== uid && !msg.isChecked,
        );

      if (newMessagesToMark.length > 0) {
        setMessagesToMarkAsChecked((prev) => [
          ...prev,
          ...newMessagesToMark.filter(
            (newMsg) =>
              !prev.some((prevMsg) => prevMsg.messageId === newMsg.messageId),
          ),
        ]);
      }
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions,
    );

    // Наблюдаем за всеми сообщениями, которые еще не прочитаны и не от текущего пользователя
    messagesArray.forEach((message) => {
      if (message.senderUid !== uid && !message.isChecked) {
        const messageElement = document.getElementById(message.messageId);
        if (messageElement && !observerElements.current.has(messageElement)) {
          observer.observe(messageElement);
          observerElements.current.add(messageElement);
        }
      }
    });

    return () => {
      observerElements.current.forEach((el) => observer.unobserve(el));
      observerElements.current.clear();
      observer.disconnect();
    };
  }, [messagesArray, activeChatId]);

  useEffect(() => {
    if (messagesToMarkAsChecked.length === 0 || !activeChatId) return;

    const markMessagesAsChecked = async () => {
      try {
        const updates = messagesToMarkAsChecked.reduce(
          (acc, message) => {
            // Помечаем сообщение как прочитанное
            acc[
              `chats/${activeChatId}/messages/${message.messageId}/isChecked`
            ] = true;
            // Удаляем из списка непрочитанных
            acc[
              `chats/${activeChatId}/unreadMessages/${uid}/${message.messageId}`
            ] = null;
            return acc;
          },
          {} as Record<string, any>,
        );

        await update(refFirebaseDatabase(firebaseDatabase), updates);

        // Очищаем обработанные сообщения
        setMessagesToMarkAsChecked([]);
      } catch (error) {
        console.error('Ошибка при обновлении статуса сообщений:', error);
      }
    };

    // debounce для batch апдейта
    const debounceTimer = setTimeout(() => {
      markMessagesAsChecked();
    }, 3000); // Задержка в мс для batch апдейта

    return () => clearTimeout(debounceTimer);
  }, [messagesToMarkAsChecked]);

  useEffect(() => {
    const observeBeforeMessages = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !observerLocked.isObserverBeforeLocked) {
          setLastChangedCounter('before');
          setObserverCounts((prev) => ({
            ...prev,
            beforeCount: prev.beforeCount + MESSAGES_LOAD_COUNT / 2,
          }));
        }
      });
    };
    const observeAfterMessages = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // если элемент нижний появился в кадре, не заблокирован и двойная подписка

        if (
          entry.isIntersecting &&
          !observerLocked.isObserverAfterLocked &&
          subscribeControl.isDualSubscribe &&
          !debouncerToggle
        ) {
          setLastChangedCounter(null);
          setObserverCounts((prev) => ({
            ...prev,
            afterCount: prev.afterCount + MESSAGES_LOAD_COUNT / 2,
          }));
          setDebouncerToggle(true);
        }
      });
    };

    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // когда видно хотя бы 10% элемента
    };

    const beforeObserver = new IntersectionObserver(
      observeBeforeMessages,
      observerOptions,
    );
    const afterObserver = new IntersectionObserver(
      observeAfterMessages,
      observerOptions,
    );

    if (beforeMessagesObserverRef.current) {
      beforeObserver.observe(beforeMessagesObserverRef.current);
    }
    if (afterMessagesObserverRef.current) {
      afterObserver.observe(afterMessagesObserverRef.current);
    }

    // очистка
    return () => {
      setDebouncerToggle(false);

      if (beforeMessagesObserverRef.current) {
        beforeObserver.unobserve(beforeMessagesObserverRef.current);
      }
      if (afterMessagesObserverRef.current) {
        afterObserver.unobserve(afterMessagesObserverRef.current);
      }
      beforeObserver.disconnect();
      afterObserver.disconnect();
    };
  }, [messagesArray]);

  useEffect(() => {
    if (!subscribeControl.isDualSubscribe) {
      if (
        messagesArray.length >=
          MESSAGES_LOAD_COUNT + observerCounts.beforeCount &&
        observerLocked.isObserverBeforeLocked
      ) {
        setObserverCounts((prev) => ({
          ...prev,
          beforeCount: prev.beforeCount + MESSAGES_LOAD_COUNT / 2,
        }));
      }
    } else if (subscribeControl.isDualSubscribe) {
      //TODO подобная логика. Там тоже может быть пусто, только если before упёрся, вниз не может упор быть.
      // у нас низ если залокается, будут ли приходить смс чекнуть, по идеи нет. Если нет, то оба каунтера както поднимать надо
      if (
        messagesArray.length >=
          MESSAGES_LOAD_COUNT / 2 + observerCounts.beforeCount &&
        observerLocked.isObserverBeforeLocked
      ) {
        setObserverCounts((prev) => ({
          ...prev,
          beforeCount: prev.beforeCount + MESSAGES_LOAD_COUNT / 2,
        }));
      }
    }
  }, [messagesArray.length]);

  useEffect(() => {
    // сохраняем позицию относительно нового контента сверху
    requestAnimationFrame(() => {
      if (
        !chatMessagesRef.current ||
        !prevScrollStateRef.current ||
        lastChangedCounter !== 'before'
      )
        return;

      if (!isSubscribeChangedScrollLocked && isSubscribeChanged) {
        // Одноразовый фикс бага с прокруткой в не то место при смене подписки
        chatMessagesRef.current.scrollTo({
          top: prevScrollStateRef.current.scrollTop,
          behavior: 'auto',
        });
        setIsSubscribeChangedScrollLocked(true);
        return;
      }

      if (forceBottomScroll) {
        chatMessagesRef.current?.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'auto',
        });

        setIsLoading(false);
        setForceBottomScroll(false);
        return;
      }

      // Логика для beforeCount с разницей в высотах прошлой и новой
      const newScrollHeight = chatMessagesRef.current.scrollHeight;
      const heightDiff =
        newScrollHeight - prevScrollStateRef.current.scrollHeight;

      chatMessagesRef.current.scrollTo({
        top: prevScrollStateRef.current.scrollTop + heightDiff,
        behavior: 'auto',
      });
    });
  }, [beforeScrollTrigger]);

  useLayoutEffect(() => {
    const getUnreadMessageId = async () => {
      if (activeChatId === null) return;
      try {
        // получение айди первого непрочитанного сообщения
        setIsUnreadMessageLoading(true);

        const firstUnreadMessagesIdsRef = refFirebaseDatabase(
          firebaseDatabase,
          `chats/${activeChatId}/unreadMessages/${uid}`,
        );

        const firstUnreadMessagesIdsSnapshot = await get(
          firstUnreadMessagesIdsRef,
        );

        if (firstUnreadMessagesIdsSnapshot.exists()) {
          // если есть непрочитанные сообщения, тогда подписка на сообщения вокруг первого непрочитанного сообщения
          const firstUnreadMessageId = Object.keys(
            firstUnreadMessagesIdsSnapshot.val(),
          )[0] as string;

          setSubscribeControl({
            isDualSubscribe: true,
            firstUnreadMessageId: firstUnreadMessageId,
          });
        } else {
          setSubscribeControl({
            isDualSubscribe: false,
            firstUnreadMessageId: '',
          });
        }
      } catch (error) {
        console.log(
          'Ошибка получения первого непрочитанного сообщения:',
          error,
        );
      } finally {
        setIsUnreadMessageLoading(false);
      }
    };

    getUnreadMessageId();
  }, [activeChatId]);

  useLayoutEffect(() => {
    // скролл при прогрузке сообщений
    if (messagesArray.length === 0 || !isChatExist) return;

    if (isMessagesLoading) {
      if (
        subscribeControl.isDualSubscribe &&
        subscribeControl.firstUnreadMessageId
      ) {
        // если есть непрочитанное сообщение, то скролл до него
        const checkElement = () => {
          const element = document.getElementById(
            subscribeControl.firstUnreadMessageId,
          );
          if (element) {
            element.scrollIntoView({ behavior: 'auto' });
            setIsMessagesLoading(false);
          } else {
            // Повторяем проверку, если элемент ещё не загружен
            requestAnimationFrame(checkElement);
          }
        };

        checkElement();
      } else if (!subscribeControl.isDualSubscribe) {
        // если нет непрочитанного сообщения, то скролл вниз
        const checkElement = () => {
          if (!chatMessagesRef.current) return;

          const lastMessageId =
            messagesArray[messagesArray.length - 1].messageId;
          const lastMessageElement = document.getElementById(lastMessageId);

          if (lastMessageElement) {
            chatMessagesRef.current.scrollTo({
              top: chatMessagesRef.current.scrollHeight,
              behavior: 'auto',
            });
            setIsMessagesLoading(false);
          } else {
            requestAnimationFrame(checkElement);
            return;
          }
        };

        checkElement();
      }
    }
  }, [messagesArray.length]);

  useLayoutEffect(() => {
    let unsubscribeBeforeMessages: (() => void) | undefined;
    let unsubscribeAfterMessages: (() => void) | undefined;

    const getMessages = async () => {
      if (activeChatId === null) return;

      const messagesRef = refFirebaseDatabase(
        firebaseDatabase,
        `chats/${activeChatId}/messages`,
      );

      if (
        subscribeControl.isDualSubscribe &&
        subscribeControl.firstUnreadMessageId
      ) {
        // сохранить текущее состояние скролла до обновления
        const prevScrollState = chatMessagesRef.current
          ? {
              scrollTop: chatMessagesRef.current.scrollTop,
              scrollHeight: chatMessagesRef.current.scrollHeight,
              clientHeight: chatMessagesRef.current.clientHeight,
            }
          : null;

        // если есть непрочитанные сообщения, тогда подписка на сообщения вокруг первого непрочитанного сообщения
        const afterQuery = query(
          messagesRef,
          orderByKey(),
          startAt(subscribeControl.firstUnreadMessageId),
          limitToFirst(MESSAGES_LOAD_COUNT / 2 + observerCounts.afterCount),
        );

        const beforeQuery = query(
          messagesRef,
          orderByKey(),
          endBefore(subscribeControl.firstUnreadMessageId),
          limitToLast(MESSAGES_LOAD_COUNT / 2 + observerCounts.beforeCount),
        );

        if (unsubscribeBeforeMessages) unsubscribeBeforeMessages();
        if (unsubscribeAfterMessages) unsubscribeAfterMessages();

        unsubscribeBeforeMessages = onValue(
          beforeQuery,
          (snapshot) => {
            const messagesBeforeUnreadFromDatabase: IMessage[] =
              Object.values(snapshot.val()) || [];

            if (
              messagesBeforeUnreadFromDatabase.length <
                MESSAGES_LOAD_COUNT / 2 + observerCounts.beforeCount &&
              !observerLocked.isObserverBeforeLocked
            ) {
              setObserverLocked((prev) => {
                return { ...prev, isObserverBeforeLocked: true };
              });
              setBeforeScrollTrigger((prev) => {
                return { ...prev, locked: true };
              });
            } else {
              // срабатывает именно при дозагрузке сообщений
              setBeforeScrollTrigger((prev) => {
                return { ...prev, toggle: !prev.toggle };
              });
            }

            dispatch(addMessages(messagesBeforeUnreadFromDatabase));
          },
          (error) => {
            console.error(
              'Ошибка при получении сообщений до первого непрочитанного:',
              error,
            );
          },
        );

        // Подписка на сообщения после первого непрочитанного
        unsubscribeAfterMessages = onValue(
          afterQuery,
          (snapshot) => {
            const messagesAfterUnreadFromDatabase: IMessage[] =
              Object.values(snapshot.val()) || [];

            if (
              messagesAfterUnreadFromDatabase.length <
              MESSAGES_LOAD_COUNT / 2 + observerCounts.afterCount
            ) {
              setSubscribeControl({
                isDualSubscribe: false,
                firstUnreadMessageId: '',
              });
              setObserverCounts((prev) => ({
                beforeCount: prev.beforeCount + prev.afterCount,
                afterCount: 0,
              }));
              setObserverLocked((prev) => ({
                ...prev,
                isObserverAfterLocked: false,
              }));
              setIsSubscribeChanged(true);
            }

            dispatch(addMessages(messagesAfterUnreadFromDatabase));
          },
          (error) => {
            console.error(
              'Ошибка при получении сообщений после первого непрочитанного:',
              error,
            );
          },
        );

        if (prevScrollState) {
          prevScrollStateRef.current = {
            scrollTop: prevScrollState.scrollTop,
            scrollHeight: prevScrollState.scrollHeight,
            clientHeight: prevScrollState.clientHeight,
          };
        }
      } else if (!subscribeControl.isDualSubscribe) {
        // если нет непрочитанных сообщений, тогда подписка на сообщения с последнего сообщения
        const messagesQuery = query(
          messagesRef,
          orderByKey(),
          limitToLast(MESSAGES_LOAD_COUNT + observerCounts.beforeCount),
        );

        if (unsubscribeBeforeMessages) unsubscribeBeforeMessages();
        if (unsubscribeAfterMessages) unsubscribeAfterMessages();

        unsubscribeAfterMessages = onValue(
          messagesQuery,
          (snapshot) => {
            const messagesFromDatabase: IMessage[] =
              Object.values(snapshot.val()) || [];

            // сохранить текущее состояние скролла до обновления
            const prevScrollState = chatMessagesRef.current
              ? {
                  scrollTop: chatMessagesRef.current.scrollTop,
                  scrollHeight: chatMessagesRef.current.scrollHeight,
                  clientHeight: chatMessagesRef.current.clientHeight,
                }
              : null;

            if (prevScrollState) {
              prevScrollStateRef.current = {
                scrollTop: prevScrollState.scrollTop, // TODO было 0, если появится баг, то оно
                scrollHeight: prevScrollState.scrollHeight,
                clientHeight: prevScrollState.clientHeight,
              };
            }

            // если получено меньше сообщений, чем в каунтерах, то блокировка добавления каунтеров
            if (
              messagesFromDatabase.length <
              MESSAGES_LOAD_COUNT + observerCounts.beforeCount
            ) {
              setObserverLocked((prev) => {
                return { ...prev, isObserverBeforeLocked: true };
              });
              setBeforeScrollTrigger((prev) => {
                return { ...prev, locked: true };
              });
            } else {
              // срабатывает именно при дозагрузке сообщений
              setBeforeScrollTrigger((prev) => {
                return { ...prev, toggle: !prev.toggle };
              });
            }

            dispatch(addMessages(messagesFromDatabase));
          },
          (error) => {
            console.error('Ошибка при получении списка сообщений:', error);
          },
        );
      }
    };

    getMessages();

    return () => {
      if (unsubscribeBeforeMessages) unsubscribeBeforeMessages();
      if (unsubscribeAfterMessages) unsubscribeAfterMessages();
    };
  }, [activeChatId, subscribeControl, observerCounts]);

  // TODO переделать логику. Сделать в самой отправке сообщения видимо, а функцию scrollToBottomSmooth вынести в хук

  useEffect(() => {
    // прокрутка секции вниз при отправке смс со стороны иного пользователя, когда ты находишься внизу экрана и чатишься
    if (
      messagesArray.length > 0 &&
      !subscribeControl.isDualSubscribe &&
      messagesArray[messagesArray.length - 1].senderUid !== uid
    ) {
      // есть баг из-за архитектуры бекенда. При смене подписки через докрутку до низа, может срабатывать срол на дозагрузку при смене подписки. Баг не фиксится
      scrollToBottomSmooth(false);
    }
  }, [messagesArray.length]);

  const smoothScroll = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottomSmooth = (isOwnMessage: boolean = true) => {
    if (chatMessagesRef.current) {
      const chatMessagesCurrent = chatMessagesRef.current;
      const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;

      // Функция прокрутки с плавной анимацией

      // setTimeout для изменений порядка выполнения кода

      if (isOwnMessage) {
        if (scrollHeight - scrollTop <= clientHeight * SCROLL_COEFFICIENT) {
          // Выполняем прокрутку плавно
          setTimeout(smoothScroll, 0);
        }
      } else if (!isOwnMessage) {
        const SCROLL_ANIMATION_LENGTH = 15; //если оставить оригинальное значение будут лишние прокрутки
        const scrollPosition = scrollHeight - scrollTop - clientHeight;
        if (scrollPosition < SCROLL_ANIMATION_LENGTH) {
          // Выполняем прокрутку плавно
          setTimeout(smoothScroll, 0);
        }
      }
    }
  };

  const scrollToBottomFastAndSmooth = () => {
    if (chatMessagesRef.current) {
      const chatMessagesCurrent = chatMessagesRef.current;
      const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;

      // setTimeout для изменений порядка выполнения кода

      if (scrollHeight - scrollTop > clientHeight * SCROLL_COEFFICIENT) {
        const scrollPosition =
          scrollHeight - clientHeight - SCROLL_ANIMATION_LENGTH;
        chatMessagesCurrent.scrollTo({
          top: scrollPosition,
          behavior: 'auto',
        });

        // Выполняем прокрутку быстро, а в конце плавно
        setTimeout(smoothScroll, 0);
      }
    }
  };

  useEffect(() => {
    const createAndSendUpdates = async () => {
      const messagesRef = refFirebaseDatabase(
        firebaseDatabase,
        `chats/${activeChatId}/messages`,
      );
  
      const messagesQuery = query(
        messagesRef,
        orderByChild('isChecked'),
        equalTo(false),
      );
  
      const messagesSnapshot = await get(messagesQuery);
  
      if (messagesSnapshot.exists() && activeChatId) {
        const messagesValue = messagesSnapshot.val() as {
          [key: string]: IMessage;
        };
        const messagesUpdates = Object.keys(messagesValue).reduce(
          (acc, messageId) => {
            const message = messagesValue[messageId];
  
            if (message.senderUid !== uid && !message.isChecked) {
              // Добавляем обновление для текущего сообщения
              acc[`chats/${activeChatId}/messages/${messageId}/isChecked`] =
                true;
            }
  
            return acc;
          },
          {} as Record<string, any>,
        );
  
        // очистка unreadMessages
        const clearOwnUnreadMessages = {
          [`chats/${activeChatId}/unreadMessages/${uid}`]: null,
        };
  
        const updates = {
          ...messagesUpdates,
          ...clearOwnUnreadMessages,
        };
  
        await update(refFirebaseDatabase(firebaseDatabase), updates);
      }
    };
    // прокрутка срабатывает при каждой отправке сообщения пользователем этого аккаунта
    if (subscribeControl.isDualSubscribe) {
      //прокрутка при двойной подписке
      setIsLoading(true);

      dispatch(clearMessages());
      setSubscribeControl({
        isDualSubscribe: false,
        firstUnreadMessageId: '',
      });
      setObserverCounts((prev) => ({
        beforeCount: prev.beforeCount + prev.afterCount,
        afterCount: 0,
      }));
      setObserverLocked((prev) => ({
        ...prev,
        isObserverAfterLocked: false,
      }));
      setIsSubscribeChanged(true);
      setForceBottomScroll(true);

      createAndSendUpdates();
    } else {
      //прокрутка при одинарной подписке
      scrollToBottomSmooth();
      scrollToBottomFastAndSmooth();
      createAndSendUpdates();
    }

    return () => {};
  }, [duringMessageSendingToggle]);

  const onBottomBtnClick = async () => {
    if (subscribeControl.isDualSubscribe) {
      //прокрутка при двойной подписке
      // TODO очистить ртк массив, очистить анрид месседжес, сделать соло подписку и прокрутить в самый низ телепортацией
      setIsLoading(true);

      try {
        dispatch(clearMessages());
        setSubscribeControl({
          isDualSubscribe: false,
          firstUnreadMessageId: '',
        });
        setObserverCounts((prev) => ({
          beforeCount: prev.beforeCount + prev.afterCount,
          afterCount: 0,
        }));
        setObserverLocked((prev) => ({
          ...prev,
          isObserverAfterLocked: false,
        }));
        setIsSubscribeChanged(true);

        const messagesRef = refFirebaseDatabase(
          firebaseDatabase,
          `chats/${activeChatId}/messages`,
        );

        const messagesQuery = query(
          messagesRef,
          orderByChild('isChecked'),
          equalTo(false),
        );

        const messagesSnapshot = await get(messagesQuery);

        if (messagesSnapshot.exists() && activeChatId) {
          const messagesValue = messagesSnapshot.val() as {
            [key: string]: IMessage;
          };
          const messagesUpdates = Object.keys(messagesValue).reduce(
            (acc, messageId) => {
              const message = messagesValue[messageId];

              if (message.senderUid !== uid && !message.isChecked) {
                // Добавляем обновление для текущего сообщения
                acc[`chats/${activeChatId}/messages/${messageId}/isChecked`] =
                  true;
              }

              return acc;
            },
            {} as Record<string, any>,
          );

          // очистка unreadMessages
          const clearOwnUnreadMessages = {
            [`chats/${activeChatId}/unreadMessages/${uid}`]: null,
          };

          const updates = {
            ...messagesUpdates,
            ...clearOwnUnreadMessages,
          };

          await update(refFirebaseDatabase(firebaseDatabase), updates);
        }
      } catch (error) {
        console.error('Ошибка при выполнении операции', error);
      } finally {
        setForceBottomScroll(true);
        // setIsLoading(false); ставится в useEffect рядом с setForceBottomScroll(false)
      }
    } else {
      //прокрутка при одинарной подписке
      scrollToBottomSmooth();
      scrollToBottomFastAndSmooth();
    }
  };

  return (
    <ComponentTag
      className={`${styles['chat-messages']} ${isLoading ? styles['loading'] : ''}`}
      ref={chatMessagesRef}
      id="chat-messages"
      onContextMenu={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
      }}
    >
      {(isLoading || isSubscribeLoading || isUnreadMessageLoading) && (
        <div className={styles['chat-messages__scroll-loader']}>
          <div
            className={styles['chat-messages__circular-progressbar-wrapper']}
          >
            <CircularProgressbar
              className={styles['chat-messages__circular-progressbar']}
              value={CIRCULAR_LOADING_PERCENT_VALUE}
              styles={buildStyles({
                // can use 'butt' or 'round'
                strokeLinecap: 'round',
                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,
                // Colors
                pathColor: 'var(--base-accent-blue)',
                /* textColor: '#f88', */
                trailColor: 'none',
              })}
            />
          </div>
        </div>
      )}

      {!isSubscribeLoading && (
        <div
          className={
            isMobileScreen
              ? 'container container--height'
              : 'container container--max-width-unset container--height'
          }
        >
          <div
            className={`${styles['chat-messages__content']} ${messagesArray.length === 0 ? styles['chat-messages__content--no-messages'] : ''}`}
          >
            <div
              className={styles['chat-messages__messages-observer']}
              ref={beforeMessagesObserverRef}
            />

            {messagesArray.length > 0 &&
              Object.entries(
                messagesArray.reduce(
                  (acc, message) => {
                    const dateKey = new Date(
                      message.messageDateUTC as number,
                    ).toLocaleDateString();
                    if (!acc[dateKey]) {
                      acc[dateKey] = []; // Инициализируем новый массив, если такой даты еще нет
                    }
                    acc[dateKey].push(message); // Добавляем сообщение к соответствующему массиву
                    return acc; // Возвращаем аккумулированный объект
                  },
                  {} as Record<string, (IMessage | ILoadingMessage)[]>,
                ),
              ).map(([date, messages]) => (
                <MessageDateGroup
                  key={date}
                  messagesArray={messages}
                  uid={uid!}
                  uploadTasksRef={uploadTasksRef}
                  chatMessagesRef={chatMessagesRef}
                />
              ))}

            <div
              className={styles['chat-messages__messages-observer']}
              ref={afterMessagesObserverRef}
            />

            {messagesArray.length === 0 && (
              <span className={styles['chat-messages__no-messages']}>
                Нет сообщений
              </span>
            )}
            <div className={styles['chat-messages__overlay-to-bottom-btn']}>
              <ToBottomBtn
                isDualSubscribe={subscribeControl.isDualSubscribe}
                onBottomBtnClick={onBottomBtnClick}
                chatMessagesRef={chatMessagesRef}
              />
            </div>
          </div>
          <div ref={endRef}></div>
        </div>
      )}
    </ComponentTag>
  );
};

export default ChatMessagesSection;
