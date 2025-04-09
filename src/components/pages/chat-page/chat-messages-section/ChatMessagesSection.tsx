import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import useMessagesFromRtk from 'src/hooks/useMessagesFromRtk';
import styles from './ChatMessagesSection.module.scss';
import ToBottomBtn from 'src/components/ui/to-bottom-btn/ToBottomBtn';
import { addMessages } from 'src/redux/slices/MessagesArraySlice';
import { useDispatch } from 'react-redux';
import { IMessage } from 'src/interfaces/Message.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import useAuth from 'src/hooks/useAuth';
import MessageDateGroup from './message-date-group/MessageDateGroup';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import SectionLoader from './section-loader/SectionLoader';

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
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import { MESSAGES_LOAD_COUNT } from 'src/constants';

interface ChatMessagesSectionProps {
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  activeChatId: string | null;
  isSubscribeLoading: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({
  isMobileScreen,
  uploadTasksRef,
  activeChatId,
  isSubscribeLoading,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  /* const [messagesArray, setMessagesArray] = useState([]); */
  const { uid } = useAuth();
  const { messagesArray } = useMessagesFromRtk();
  const endRef = useRef<HTMLDivElement>(null);
  const beforeMessagesObserverRef = useRef<HTMLDivElement>(null);
  const afterMessagesObserverRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const [doScroll, setDoScroll] = useState<boolean>(false);

  const [lastChangedCounter, setLastChangedCounter] = useState<'before' | null>(null);

  const prevScrollStateRef = useRef<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }>({ scrollTop: 0, scrollHeight: 0, clientHeight: 0 });
  const [debouncerCounts, setВebouncerCounts] = useState<{
    after: boolean;
    before: boolean;
  }>({ after: false, before: false });
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
  const dispatch = useDispatch();

  //TODO удалить отладку
  const test = {
    bool:
      MESSAGES_LOAD_COUNT +
        observerCounts.beforeCount +
        observerCounts.afterCount <
      messagesArray.length,
    mesLength: messagesArray.length,
    countersLength:
      MESSAGES_LOAD_COUNT +
      observerCounts.beforeCount +
      observerCounts.afterCount,
  };
  /*     console.table(test);
  console.table(observerCounts); */

  useEffect(() => {
    const observeBeforeMessages = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !observerLocked.isObserverBeforeLocked &&
          !debouncerCounts.before
        ) {
          setLastChangedCounter('before'); 
          setObserverCounts((prev) => ({
            ...prev,
            beforeCount: prev.beforeCount + MESSAGES_LOAD_COUNT / 2,
          }));
          setВebouncerCounts((prev) => ({ ...prev, before: true }));
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
          !debouncerCounts.after
        ) {
          setLastChangedCounter(null); 
          setObserverCounts((prev) => ({
            ...prev,
            afterCount: prev.afterCount + MESSAGES_LOAD_COUNT / 2,
          }));
          setВebouncerCounts((prev) => ({ ...prev, after: true }));
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
      setВebouncerCounts({ after: false, before: false });

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

  useLayoutEffect(() => {
    const getUnreadMessageId = async () => {
      if (activeChatId === null) return;
      // получение айди первого непрочитанного сообщения
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
    };

    getUnreadMessageId();
  }, [activeChatId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!chatMessagesRef.current || !prevScrollStateRef.current) return;
      
      const newScrollHeight = chatMessagesRef.current.scrollHeight;
      const heightDiff = newScrollHeight - prevScrollStateRef.current.scrollHeight;
  
      if (lastChangedCounter === 'before') {
        // Логика для beforeCount - сохраняем позицию относительно нового контента сверху
        chatMessagesRef.current.scrollTo({
          top: prevScrollStateRef.current.scrollTop + heightDiff,
          behavior: 'auto',
        });
      }
    });
  }, [prevScrollStateRef.current, lastChangedCounter]);

  useLayoutEffect(() => {
    let unsubscribeBeforeMessages: (() => void) | undefined;
    let unsubscribeAfterMessages: (() => void) | undefined;

    const saveScrollPosition = (
      prevScrollState: {
        scrollTop: number;
        scrollHeight: number;
        clientHeight: number;
      } | null,
    ) => {
      requestAnimationFrame(() => {
        if (!chatMessagesRef.current || !prevScrollState) return;

        const newScrollHeight = chatMessagesRef.current.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollState.scrollHeight;
        // восстанавить позицию с учетом новой высоты
        chatMessagesRef.current.scrollTo({
          top: prevScrollState.scrollTop + heightDiff,
          behavior: 'auto',
        });
      });
    };

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
                MESSAGES_LOAD_COUNT / 2 + observerCounts.afterCount &&
              !observerLocked.isObserverAfterLocked
            ) {
              setObserverLocked((prev) => {
                return { ...prev, isObserverAfterLocked: true };
              });
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

        if (unsubscribeAfterMessages) unsubscribeAfterMessages();

        unsubscribeAfterMessages = onValue(
          messagesQuery,
          (snapshot) => {
            const messagesFromDatabase: IMessage[] =
              Object.values(snapshot.val()) || [];

            // если получено меньше сообщений, чем в каунтерах, то блокировка добавления каунтеров
            if (
              messagesFromDatabase.length <
              MESSAGES_LOAD_COUNT + observerCounts.beforeCount
            ) {
              setObserverLocked((prev) => {
                return { ...prev, isObserverBeforeLocked: true };
              });
            }

            // сохранить текущее состояние скролла до обновления
            const prevScrollState = chatMessagesRef.current
              ? {
                  scrollTop: chatMessagesRef.current.scrollTop,
                  scrollHeight: chatMessagesRef.current.scrollHeight,
                  clientHeight: chatMessagesRef.current.clientHeight,
                }
              : null;

            dispatch(addMessages(messagesFromDatabase));
            saveScrollPosition(prevScrollState);
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

  // TODO переделать логику
  //useLayoutEffect(() => {
  //  /*  скролл вниз секции */
  // вот этот код выполнять, если нет unreadMessage
  //  /* логику изменить. прокручивать до непрочитанного чата надо будет, а не вниз. но если таких нет, то вниз */
  //  endRef.current?.scrollIntoView({ behavior: 'auto' });
  //  return () => {};
  //}, [doScroll, isSubscribeLoading]);

  const scrollToBottom = (isOwnMessage: boolean) => {
    if (chatMessagesRef.current) {
      const chatMessagesCurrent = chatMessagesRef.current;
      const animationLength = 80;
      const scrollCoefficient = 2.8;
      const { scrollTop, clientHeight, scrollHeight } = chatMessagesCurrent;

      // Функция прокрутки с плавной анимацией
      const smoothScroll = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      // setTimeout для изменений порядка выполнения кода

      if (isOwnMessage) {
        if (scrollHeight - scrollTop > clientHeight * scrollCoefficient) {
          const scrollPosition = scrollHeight - clientHeight - animationLength;
          chatMessagesCurrent.scrollTo({
            top: scrollPosition,
            behavior: 'auto',
          });

          // Выполняем прокрутку плавно с задержкой
          setTimeout(smoothScroll, 0);
        } else {
          setTimeout(smoothScroll, 0);
        }
      } else if (!isOwnMessage) {
        const scrollPosition = scrollHeight - scrollTop - clientHeight;
        if (scrollPosition < animationLength) {
          setTimeout(smoothScroll, 0);
        }
      }
    }
  };

  // TODO переделать логику. Сделать в самой отправке сообщения видимо, а функцию scrollToBottom вынести в хук

  //useEffect(() => {
  //  // прокрутка секции вниз при отправке смс со стороны пользователя любого, когда ты находишься внизу экрана и чатишься
  //  if (messagesArray.length > 0) {
  //    // TODO оставить логику прокрутки только если мы в 80пикселях, короче только smooth логику. А логику прокрутки быстрой + остановку мягкую вынести в саму отправку сообщения
  //    scrollToBottom(messagesArray[messagesArray.length - 1].senderUid === uid);
  //  }
  //  return () => {};
  //}, [messagesArray.length]);

  if (isSubscribeLoading) {
    return <SectionLoader />;
  }

  return (
    <ComponentTag
      className={styles['chat-messages']}
      ref={chatMessagesRef}
      id="chat-messages"
      onContextMenu={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
      }}
    >
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
          ></div>
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
          ></div>
          {messagesArray.length === 0 && (
            <span className={styles['chat-messages__no-messages']}>
              Нет сообщений
            </span>
          )}
          <div className={styles['chat-messages__overlay-to-bottom-btn']}>
            <ToBottomBtn
              scrollToBottom={() => scrollToBottom(true)}
              chatMessagesRef={chatMessagesRef}
            />
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
    </ComponentTag>
  );
};

export default ChatMessagesSection;
