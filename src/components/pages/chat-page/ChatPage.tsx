import { FC, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatPage.module.scss';
import ChatFooter from './chat-footer/ChatFooter';
import ChatHeader from './chat-header/ChatHeader';
import ChatMessagesSection from './chat-messages-section/ChatMessagesSection';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import useMobileScreen from 'src/hooks/useMobileScreen';
import CustomToastContainer from 'src/components/ui/custom-toast-container/CustomToastContainer';
import { useLocation, useNavigate } from 'react-router-dom';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import useActiveChat from 'src/hooks/useActiveChat';

import { ref as refFirebaseDatabase, onValue, get } from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbUser,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
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
import ChatMessagesSectionLoader from './chat-messages-section-loader/ChatMessagesSectionLoader';
import { addChatInputValue } from 'src/redux/slices/ChatInputValues';

const ChatPage: FC = () => {
  const { isMobileScreen } = useMobileScreen();
  const ComponentTag = isMobileScreen ? 'main' : 'section';
  const uploadTasksRef = useRef<IUploadTasksRef>({});
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [isSubscribeLoading, setIsSubscribeLoading] = useState<boolean>(false);
  const { uid } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as ILocationChatPage | null; // null, если стейта нет
  const {
    activeChatId,
    activeChatAvatar,
    activeChatname,
    activeChatMembers,
    activeChatIsGroup,
    } = useActiveChat();

    console.log(isSubscribeLoading)

  useLayoutEffect(() => {
    if (activeChatId != null) {
      setIsSubscribeLoading(true);
    } else {
      setIsSubscribeLoading(false);
    }
  }, [locationState, activeChatId]);

  useLayoutEffect(() => {
    if (activeChatId !== null) {
      dispatch(
        addChatInputValue({
          chatId: activeChatId,
        }),
      );
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
              const membersIds = snapshot.val() as string[];
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

  
  const onDragEnter = (event: React.DragEvent) => {
    if (!isMobileScreen) {
      event.preventDefault();
      setIsDrag(true);
    }
  };

  return (
    <ComponentTag onDragEnter={onDragEnter} className={styles['main']}>
      <ChatHeader
        isMobileScreen={isMobileScreen}
        isSubscribeLoading={isSubscribeLoading}
        avatar={
          activeChatAvatar !== null
            ? activeChatAvatar
            : locationState?.chatAvatarFromGlobalSearch ||
              USER_AVATAR_DEFAULT_VALUE
        }
        chatname={
          activeChatname !== null
            ? activeChatname
            : locationState?.chatnameFromGlobalSearch || USERNAME_DEFAULT_VALUE
        }
      />
      {isSubscribeLoading === false && (
        <ChatMessagesSection
          activeChatId={activeChatId}
          uploadTasksRef={uploadTasksRef}
          isMobileScreen={isMobileScreen}
        />
      )}
      {isSubscribeLoading === true && (
        //УДАЛИТЬ, ОНО БУДЕТ В САМОЙ СЕКЦИИ
        <ChatMessagesSectionLoader />
      )}
      <ChatFooter
        activeChatId={activeChatId}
        isSubscribeLoading={isSubscribeLoading}
        isDrag={isDrag}
        setIsDrag={setIsDrag}
        uploadTasksRef={uploadTasksRef}
        isMobileScreen={isMobileScreen}
        locationState={locationState}
      />
      <CustomToastContainer />
    </ComponentTag>
  );
};

export default ChatPage;
