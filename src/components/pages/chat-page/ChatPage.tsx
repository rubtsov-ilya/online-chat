import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatPage.module.scss';
import ChatBottomSection from './chat-bottom-section/ChatBottomSection';
import ChatTopSection from './chat-top-section/ChatTopSection';
import ChatMessagesSection from './chat-messages-section/ChatMessagesSection';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import useMobileScreen from 'src/hooks/useMobileScreen';
import CustomToastContainer from 'src/components/ui/custom-toast-container/CustomToastContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import useActiveChat from 'src/hooks/useActiveChat';

import {
  ref as refFirebaseDatabase,
  onValue,
  get,
  update,
  serverTimestamp,
  push,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import { IFirebaseRtDbChat } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import { useDispatch } from 'react-redux';
import {
  setActiveChatBlocked,
  setActiveChatMembers,
} from 'src/redux/slices/ActiveChatSlice';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';
import {
  USERNAME_DEFAULT_VALUE,
  USER_AVATAR_DEFAULT_VALUE,
} from 'src/constants';
import { addChatInputValue } from 'src/redux/slices/ChatInputValuesSlice';
import {
  clearSelectedMessagesState,
  setIsMessagesForwarding,
} from 'src/redux/slices/SelectedMessagesSlice';
import useSelectedMessages from 'src/hooks/useSelectedMessages';
import ModalBackdrop from 'src/components/ui/modal-backdrop/ModalBackdrop';
import ModalActionConfirm from 'src/components/ui/modal-action-confirm/ModalActionConfirm';
import useToggleModal from 'src/hooks/useToggleModal';
import { IMessage } from 'src/interfaces/Message.interface';
import { addMessage, clearMessages } from 'src/redux/slices/MessagesArraySlice';

const ChatPage: FC = () => {
  const uploadTasksRef = useRef<IUploadTasksRef>({});
  const [modalOpen, setModalOpen] = useState<'forward' | false>(false);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [isSubscribeLoading, setIsSubscribeLoading] = useState<boolean>(false);
  const [duringMessageSendingToggle, setDuringMessageSendingToggle] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isMobileScreen } = useMobileScreen();
  const {
    isMessagesForwarding,
    selectedMessages,
    selectedChatId,
    selectedChatMembers,
  } = useSelectedMessages();
  const { uid } = useAuth();
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const ComponentTag = isMobileScreen ? 'main' : 'section';
  const locationState = location.state as ILocationChatPage | null; // null, если стейта нет
  const {
    activeChatId,
    activeChatAvatar,
    activeChatname,
    activeChatMembers,
    activeChatIsGroup,
  } = useActiveChat();

  const modalActionData = {
    forward: {
      title: 'Переслать',
      subtitle: `Переслать ${selectedMessages.length > 1 ? 'сообщения' : 'сообщение'} в чат?`,
      actionBtnText: 'Переслать',
      avatar: activeChatAvatar!,
      isGroup:activeChatIsGroup!,
      action: async () => {
        try {
          if (selectedChatMembers === null) {
            throw new Error(
              `Ошибка при пересылке ${selectedMessages.length > 1 ? 'сообщений' : 'сообщения'}`,
            );
          }

          const selectedMessagesFromDatabase = await Promise.all(
            selectedMessages.map(async (message) => {
              const messageRef = refFirebaseDatabase(
                firebaseDatabase,
                `chats/${selectedChatId}/messages/${message.messageId}`,
              );
              const messageSnapshot = await get(messageRef);
              return messageSnapshot.val();
            }),
          );

          const messagesWithFirebaseIds: IMessage[] =
            selectedMessagesFromDatabase
              .map((message: IMessage) => {
                const messageRef = refFirebaseDatabase(
                  firebaseDatabase,
                  `chats/${activeChatId}/messages`,
                );
                const firebaseMessageId = push(messageRef).key;
                if (firebaseMessageId === null) {
                  return null;
                }
                return {
                  ...message,
                  messageDateUTC: serverTimestamp(),
                  messageId: firebaseMessageId,
                  answerToMessage: '',
                  isChecked: false,
                  isDeleted: false,
                  isLoading: false,
                  isEdited: false,
                  senderUid: uid,
                  media: message.media || [],
                  files: message.files || [],
                  messageText: message.messageText || '',
                };
              })
              .filter((message) => message !== null) as IMessage[];

          // добавление сообщений локально с загрузкой
          const loadingMessagesWithFirebaseIds: IMessage[] = messagesWithFirebaseIds.map(
            (message) => ({
              ...message,
              isLoading: true,
              messageDateUTC: `${new Date()}`
            }),
          )

          dispatch(addMessage(loadingMessagesWithFirebaseIds));
          
          // updates
          const membersIds = selectedChatMembers.map((member) => member.uid);

          // updates by unreadMessages
          const filteredMembersIds = membersIds.filter(
            (memberId) => memberId !== uid,
          );
          const updatesByUnreadMessages = filteredMembersIds.reduce(
            (acc, memberId) => {
              messagesWithFirebaseIds.forEach((message) => {
                if (message !== null) {
                  acc[
                    `chats/${activeChatId}/unreadMessages/${memberId}/${message.messageId}`
                  ] = true;
                }
              });
              return acc;
            },
            {} as Record<string, any>,
          );

          // updates by userChats
          const lastMessageWithFirebaseId =
            messagesWithFirebaseIds[messagesWithFirebaseIds.length - 1];
          const updatesByUserChats = membersIds.reduce(
            (acc, memberId) => {
              acc[
                `userChats/${memberId}/chats/${activeChatId}/lastMessageText`
              ] = lastMessageWithFirebaseId.messageText;
              acc[
                `userChats/${memberId}/chats/${activeChatId}/lastMessageDateUTC`
              ] = lastMessageWithFirebaseId.messageDateUTC;
              acc[
                `userChats/${memberId}/chats/${activeChatId}/lastMessageIsChecked`
              ] = lastMessageWithFirebaseId.isChecked;
              acc[
                `userChats/${memberId}/chats/${activeChatId}/lastMessageSenderUid`
              ] = uid;
              return acc;
            },
            {} as Record<string, any>,
          );

          // updates by chat
          const updatesByChats = messagesWithFirebaseIds.reduce(
            (acc, message) => {
              if (message !== null) {
                // Проверяем, что сообщение не null
                acc[`chats/${activeChatId}/messages/${message.messageId}`] =
                  message;
              }
              return acc;
            },
            {} as Record<string, any>,
          );

          // updates by forwarding
          const updatesByForwarding = {
            ...updatesByUnreadMessages,
            ...updatesByUserChats,
            ...updatesByChats,
          };

          await update(
            refFirebaseDatabase(firebaseDatabase),
            updatesByForwarding,
          );


        } catch (error) {
          console.error('Ошибка пересылки сообщений:', error);

          throw error;
        }
      },
    },
  };

  const modalDuration = 100;

  useLayoutEffect(() => {
    if (activeChatId !== null) {
      setIsSubscribeLoading(true);
    } else {
      setIsSubscribeLoading(false);
    }
  }, [locationState, activeChatId]);

  useLayoutEffect(() => {
    // очистка сообщений всех при смене чат айди
    dispatch(clearMessages());

    if (activeChatId !== null) {
      // добавление чат инпута
      dispatch(
        addChatInputValue({
          chatId: activeChatId,
        }),
      );
      if (!isMessagesForwarding) {
        // очистка выбранных сообщений
        dispatch(clearSelectedMessagesState());
      }
    }
  }, [activeChatId]);

  useLayoutEffect(() => {
    // если нет locationState и activeChatId, перенаправляем на список чатов
    if (locationState === null && activeChatId === null) {
      navigate('/chats', { replace: true });
      return;
    }

    let unsubscribeMembers: (() => void) | undefined;
    let unsubscribeUserBlocked: (() => void) | undefined;

    const updateMembersDetails = async (
      membersIds: string[],
      currentMembers: IMemberDetails[],
    ) => {
      // найти новых участников
      const newMemberIds = membersIds.filter(
        (id) => !currentMembers.some((member) => member.uid === id),
      );

      // найти удалённых участников
      const removedMemberIds = currentMembers.filter(
        (member) => !membersIds.includes(member.uid),
      );

      // удалить ушедших участников
      let updatedMembers = currentMembers.filter(
        (member) =>
          !removedMemberIds.some((removed) => removed.uid === member.uid),
      );

      // запросить данные для новых участников
      const newMembersDetails: IMemberDetails[] = await Promise.all(
        newMemberIds.map(async (memberUid) => {
          const userRef = refFirebaseDatabase(
            firebaseDatabase,
            `users/${memberUid}`,
          );

          try {
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
              const userValue = userSnapshot.val() as IMemberDetails;

              return {
                uid: memberUid,
                username: userValue.username || USERNAME_DEFAULT_VALUE,
                avatar: userValue.avatar || USER_AVATAR_DEFAULT_VALUE,
                blocked: userValue.blocked || [],
              };
            }
          } catch (error) {
            console.error(
              `Ошибка при получении данных пользователя для ${memberUid}:`,
              error,
            );
          }

          return {
            uid: memberUid,
            username: USERNAME_DEFAULT_VALUE,
            avatar: USER_AVATAR_DEFAULT_VALUE,
            blocked: [],
          };
        }),
      );

      updatedMembers = [...updatedMembers, ...newMembersDetails];

      dispatch(
        setActiveChatMembers({
          activeChatMembers: updatedMembers,
        }),
      );
      setIsSubscribeLoading(false);
    };

    const getChatData = async () => {
      // если чат из поиска (locationState !== null && activeChatId == null, остальное для ts, чтобы не подчеркивал)
      if (activeChatId === null || uid === null || activeChatMembers === null)
        return;

      // если чат из списка чатов пользователя
      try {
        //если чат не групповой
        if (activeChatIsGroup === false) {
          const otherMemberUid = activeChatMembers.find(
            (member) => member.uid !== uid,
          )?.uid;

          if (otherMemberUid) {
            // подписываемся только на изменения "blocked" иного пользователя = не себя
            const userBlockedRef = refFirebaseDatabase(
              firebaseDatabase,
              `users/${otherMemberUid}/blocked`,
            );

            if (unsubscribeUserBlocked) unsubscribeUserBlocked();

            unsubscribeUserBlocked = onValue(
              userBlockedRef,
              (snapshot) => {
                const blockedList: string[] = snapshot.val() || [];
                dispatch(
                  setActiveChatBlocked({
                    activeChatBlocked: blockedList,
                  }),
                );
                setIsSubscribeLoading(false);
              },
              (error) => {
                console.error(
                  'Ошибка при получении списка заблокированных:',
                  error,
                );
              },
            );
          }
        } else {
          // если чат групповой
          // подписываемся на изменения участников
          const membersRef = refFirebaseDatabase(
            firebaseDatabase,
            `userChats/${uid}/chats/${activeChatId}/membersIds`,
          );

          if (unsubscribeMembers) unsubscribeMembers();
          unsubscribeMembers = onValue(
            membersRef,
            async (snapshot) => {
              if (!snapshot.exists()) return;
              const membersIds = Object.keys(
                snapshot.val() as IFirebaseRtDbChat['membersIds'],
              );
              await updateMembersDetails(membersIds, activeChatMembers || []);
            },
            (error) => {
              console.error(
                'Ошибка при подписке на изменения участников:',
                error,
              );
            },
          );
        }
      } catch (error) {
        console.error('Ошибка при получении данных чата:', error);
      }
    };

    getChatData();

    return () => {
      if (unsubscribeMembers) unsubscribeMembers();
      if (unsubscribeUserBlocked) unsubscribeUserBlocked();
    };
  }, [activeChatId, locationState]);

  useEffect(() => {
    // открывает модальное окно пересылки сообщений, если isMessagesForwarding === true
    if (isMessagesForwarding) {
      setModalOpen('forward');
    }
    return () => {};
  }, [isMessagesForwarding]);

  const clearSelectedMessages = () => {
    dispatch(setIsMessagesForwarding({ isMessagesForwarding: false }));
    dispatch(clearSelectedMessagesState());
  };

  const onDragEnter = (event: React.DragEvent) => {
    if (!isMobileScreen) {
      event.preventDefault();
      setIsDrag(true);
    }
  };

  return (
    <>
      <ComponentTag onDragEnter={onDragEnter} className={styles['main']}>
        <ChatTopSection
          isMobileScreen={isMobileScreen}
          isSubscribeLoading={isSubscribeLoading}
          locationUid={
            locationState ? locationState.userUidFromGlobalSearch : null
          }
          avatar={
            activeChatAvatar !== null
              ? activeChatAvatar
              : locationState?.chatAvatarFromGlobalSearch ||
                USER_AVATAR_DEFAULT_VALUE
          }
          chatname={
            activeChatname !== null
              ? activeChatname
              : locationState?.chatnameFromGlobalSearch ||
                USERNAME_DEFAULT_VALUE
          }
        />
        <ChatMessagesSection
          duringMessageSendingToggle={duringMessageSendingToggle}
          isSubscribeLoading={isSubscribeLoading}
          activeChatId={activeChatId}
          uploadTasksRef={uploadTasksRef}
          isMobileScreen={isMobileScreen}
          isChatExist={locationState ? false : true}
        />
        <ChatBottomSection
          activeChatId={activeChatId}
          isSubscribeLoading={isSubscribeLoading}
          isDrag={isDrag}
          uploadTasksRef={uploadTasksRef}
          isMobileScreen={isMobileScreen}
          locationState={locationState}
          setIsDrag={setIsDrag}
          setDuringMessageSendingToggle={setDuringMessageSendingToggle}
        />
        <CustomToastContainer />
        <div id="message-context-backdrop"></div>
      </ComponentTag>
      {modalOpen && (
        <ModalBackdrop
          transitionDuration={modalDuration}
          toggleModal={() =>
            toggleModal(false, modalDuration, clearSelectedMessages)
          }
          divIdFromIndexHtml={'modal-backdrop'}
        >
          <ModalActionConfirm
            isMobileScreen={isMobileScreen}
            title={modalActionData[modalOpen].title}
            subtitle={modalActionData[modalOpen].subtitle}
            actionBtnText={modalActionData[modalOpen].actionBtnText}
            action={modalActionData[modalOpen].action}
            avatar={modalActionData[modalOpen].avatar}
            isGroup={modalActionData[modalOpen].isGroup}
          />
        </ModalBackdrop>
      )}
    </>
  );
};

export default ChatPage;
