import { FC, useEffect, useState } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import CopySvg from 'src/assets/images/icons/24x24-icons/Copy.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatTopSection.module.scss';
import { useNavigate } from 'react-router-dom';
import useActiveChat from 'src/hooks/useActiveChat';
import useAuth from 'src/hooks/useAuth';
import { firebaseDatabase } from 'src/firebase';
import {
  onValue,
  equalTo,
  get,
  orderByChild,
  query,
  ref as refFirebaseDatabase,
  update,
  serverTimestamp,
} from 'firebase/database';
import {
  CHAT_INFO_STATUS_OFFLINE,
  CHAT_INFO_STATUS_ONLINE,
  CHAT_INFO_STATUS_WRITING,
} from 'src/constants';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import DotsBounceLoader from 'src/components/ui/dots-bounce-loader/DotsBounceLoader';
import useSelectedMessages from 'src/hooks/useSelectedMessages';
import { clearSelectedMessagesState } from 'src/redux/slices/SelectedMessagesSlice';
import { useDispatch } from 'react-redux';
import FlipNumbers from 'react-flip-numbers';
import useMessagesFromRtk from 'src/hooks/useMessagesFromRtk';
import { IFirebaseRtDbChat } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import getLastUndeletedMessage from 'src/services/getLastUndeletedMessage';
import { IMessage } from 'src/interfaces/Message.interface';
import { removeActiveChat } from 'src/redux/slices/ActiveChatSlice';

interface ChatTopSectionProps {
  isMobileScreen?: boolean;
  avatar: string;
  chatname: string;
  isSubscribeLoading: boolean;
  locationUid: ILocationChatPage['userUidFromGlobalSearch'] | null;
}

const ChatTopSection: FC<ChatTopSectionProps> = ({
  isMobileScreen,
  avatar,
  chatname,
  isSubscribeLoading,
  locationUid,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  const { uid } = useAuth();
  const [chatStatus, setChatStatus] = useState<string>('');
  const [writingUsers, setWritingUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    activeChatMembers,
    activeChatIsGroup,
    activeChatId,
  } = useActiveChat();
  const { isMessagesSelecting, selectedMessages } = useSelectedMessages();
  const { messagesArray } = useMessagesFromRtk();

  // получаем имя печатющего пользователя для группового чата
  const username =
    activeChatIsGroup === true &&
    activeChatMembers !== null &&
    writingUsers.length > 0
      ? activeChatMembers
          .find((member) => member.uid === writingUsers[0])
          ?.username.slice(0, 20) || ''
      : '';

  useEffect(() => {
    let unsubscribeUserIsOnline: (() => void) | undefined;
    let unsubscribeWritingUsers: (() => void) | undefined;

    if (
      (activeChatMembers !== null && activeChatIsGroup !== null) ||
      locationUid !== null
    ) {
      if (isSubscribeLoading === true) {
        setChatStatus('');
      } else if (
        (isSubscribeLoading === false && activeChatIsGroup === false) ||
        locationUid !== null
      ) {
        // если чат не групповой
        const otherMemberUid =
          activeChatMembers?.find((member) => member.uid !== uid)?.uid ||
          locationUid;

        if (otherMemberUid) {
          const userIsOnlineRef = refFirebaseDatabase(
            firebaseDatabase,
            `users/${otherMemberUid}/isOnline`,
          );

          if (unsubscribeUserIsOnline) unsubscribeUserIsOnline();

          unsubscribeUserIsOnline = onValue(
            userIsOnlineRef,
            (snapshot) => {
              const isUserOnline: boolean = snapshot.val() || false;
              if (isUserOnline === false) {
                setChatStatus(CHAT_INFO_STATUS_OFFLINE);
              } else if (isUserOnline === true) {
                setChatStatus(CHAT_INFO_STATUS_ONLINE);
              }
            },
            (error) => {
              console.error('Ошибка при получении статуса online:', error);
            },
          );
        }
      } else if (
        isSubscribeLoading === false &&
        activeChatIsGroup === true &&
        activeChatMembers !== null
      ) {
        // если чат групповой
        const membersCount = activeChatMembers.length;
        const membersText =
          membersCount === 1
            ? 'участник'
            : membersCount >= 2 && membersCount <= 4
              ? 'участника'
              : 'участников';
        setChatStatus(`${membersCount} ${membersText}`);
      }
    }

    // подписка на writingUsers
    if (isSubscribeLoading === true) {
      setWritingUsers([]);
    } else if (isSubscribeLoading === false && activeChatId) {
      const writingUsersRef = refFirebaseDatabase(
        firebaseDatabase,
        `chats/${activeChatId}/writingUsers`,
      );

      unsubscribeWritingUsers = onValue(
        writingUsersRef,
        (snapshot) => {
          const writingUsersData = snapshot.val(); // объект вида { uid1: true, uid2: true, ... }

          if (writingUsersData) {
            // извлекаем ключи (UID`s) из объекта и фильтруем текущего пользователя
            const writingUsersArray = Object.keys(writingUsersData).filter(
              (userUid) => userUid !== uid,
            );

            setWritingUsers(writingUsersArray);
          } else {
            setWritingUsers([]);
          }
        },
        (error) => {
          console.error('Ошибка при подписке на writingUsers:', error);
        },
      );
    }

    return () => {
      if (unsubscribeUserIsOnline) {
        unsubscribeUserIsOnline();
      }
      if (unsubscribeWritingUsers) {
        unsubscribeWritingUsers();
      }
    };
  }, [activeChatMembers, isSubscribeLoading, locationUid, activeChatId]);

  const onBackBtnClick = () => {
    if (isMessagesSelecting) {
      dispatch(clearSelectedMessagesState());
    } else {
      navigate('/chats');
    }
  };

  const onDeleteBtnClick = async () => {
    try {
      if (activeChatMembers === null || activeChatId === null) {
        dispatch(clearSelectedMessagesState());
        return;
      }

      const lastMessageDateUTCRef = refFirebaseDatabase(
        firebaseDatabase,
        `userChats/${uid}/chats/${activeChatId}/lastMessageDateUTC`,
      );

      const lastMessageDateUTCSnapshot = await get(lastMessageDateUTCRef);

      if (!lastMessageDateUTCSnapshot.exists()) {
        throw new Error('Чат не найден');
      }

      const lastMessageDateUTCValue =
        lastMessageDateUTCSnapshot.val() as IFirebaseRtDbChat['lastMessageDateUTC'];

      // обновляем сообщения как удаленные

      const updatesByMessages = selectedMessages.reduce(
        (acc, cur) => {
          acc[`chats/${activeChatId}/messages/${cur.messageId}/isDeleted`] =
            true;
          return acc;
        },
        {} as Record<string, any>,
      );

      await update(refFirebaseDatabase(firebaseDatabase), updatesByMessages);

      dispatch(clearSelectedMessagesState());

      // получаем последнее неудаленное сообщение в чате, значение в удалемом уже будет обновлено
      const lastUndeletedMessage = await getLastUndeletedMessage(activeChatId);

      if (lastUndeletedMessage === null && activeChatIsGroup === false) {
        // lastUndeletedMessage === null в случае, если нет неудаленных сообщений
        // тогда нужно указать, что история очищена

        const membersIds = activeChatMembers.map((member) => member.uid);

        const updatesByUnreadMessages = {
          [`chats/${activeChatId}/unreadMessages`]: null,
        };

        const newChatsData = {
          lastMessageText: 'История очищена',
          lastMessageDateUTC: serverTimestamp(),
          lastMessageIsChecked: null,
          lastMessageSenderUid: uid!,
        };

        const updatesByUserChats = membersIds.reduce(
          (acc, memberUid) => {
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageDateUTC`
            ] = newChatsData.lastMessageDateUTC;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageIsChecked`
            ] = newChatsData.lastMessageIsChecked;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageSenderUid`
            ] = newChatsData.lastMessageSenderUid;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageText`
            ] = newChatsData.lastMessageText;
            return acc;
          },
          {} as Record<string, any>,
        );

        const updatesByChatClearing = {...updatesByUserChats, ...updatesByUnreadMessages}

        await update(refFirebaseDatabase(firebaseDatabase), updatesByChatClearing);

        return;
      }

      // проверяем, является ли последнее неудаленное сообщение тем, что на данный момент установлено в usersChats/uid/chats/chatId
      const isLastUndeletedMessageDifferent =
        lastUndeletedMessage?.messageDateUTC !== lastMessageDateUTCValue; // выдаст true если сообщения отличаются, тогда нужно обновлять значения в usersChats/uid/chats/chatId всем участникам

      if (isLastUndeletedMessageDifferent && lastUndeletedMessage !== null) {
        // если последнее сообщение не то, что сейчас установлено, обновляем userChats для всех участников
        const membersIds = activeChatMembers.map((member) => member.uid);
        // TODO тут нужно чтобы ещё апдейтило unreadMessages

        const updatesByUnreadMessages = membersIds.reduce((acc, memberId) => {
          selectedMessages.forEach((selectedMessage) => {
            acc[`chats/${activeChatId}/unreadMessages/${memberId}/${selectedMessage.messageId}`] = null;
          });
          return acc;
        }, {} as Record<string, any>);

        const updatesByUserChats = membersIds.reduce(
          (acc, memberUid) => {
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageDateUTC`
            ] = lastUndeletedMessage.messageDateUTC;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageIsChecked`
            ] = lastUndeletedMessage.isChecked;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageSenderUid`
            ] = lastUndeletedMessage.senderUid;
            acc[
              `userChats/${memberUid}/chats/${activeChatId}/lastMessageText`
            ] = lastUndeletedMessage.messageText;
            return acc;
          },
          {} as Record<string, any>,
        );

        const updatesByChat = {...updatesByUserChats, ...updatesByUnreadMessages}

        await update(refFirebaseDatabase(firebaseDatabase), updatesByChat);
      }
    } catch (error) {
      console.error('Ошибка удаления сообщения:', error);
      throw error;
    }
  };

  const onCopyBtnClick = () => {
    const selectedMessagesTextes: string[] = messagesArray
      .filter((message) =>
        selectedMessages.some(
          (selectedMessage) => selectedMessage.messageId === message.messageId,
        ),
      )
      .filter((message) => message.messageText.trim() !== '') // Исключаем сообщения с пустым текстом
      .map((message) => message.messageText);

    navigator.clipboard.writeText(selectedMessagesTextes.join('\n\n'));
    dispatch(clearSelectedMessagesState());
  };

  return (
    <ComponentTag className={styles['chat-top-section']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-top-section__content']}>
          <div className={styles['chat-top-section__back-wrapper']}>
            <button
              onClick={onBackBtnClick}
              className={styles['chat-top-section__back-btn']}
            >
              <LeftChevronSvg
                className={`${styles['chat-top-section__back-icon']} ${!isMessagesSelecting ? styles['active'] : ''}`}
              />
              <CloseSvg
                className={`${styles['chat-top-section__back-icon']} ${isMessagesSelecting ? styles['active'] : ''}`}
              />
            </button>
            {isMessagesSelecting && (
              <FlipNumbers
                numberStyle={{
                  fontFamily: 'var(--font-family)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums',
                }}
                height={13}
                width={9}
                color={`var(--base-black)`}
                play
                perspective={100}
                numbers={`${selectedMessages.length}`}
              />
            )}
          </div>

          {!isMessagesSelecting && (
            <>
              <div className={styles['chat-top-section__middle-wrapper']}>
                <span className={styles['chat-top-section__chatname']}>
                  {chatname}
                </span>
                {/* если не получен статус, отображать анимированные ... */}
                {chatStatus.length === 0 && (
                  <span className={styles['chat-top-section__info']}>
                    <DotsBounceLoader />
                  </span>
                )}
                {/* если получен статус, и нет печатающих пользователей, отображать статус */}
                {chatStatus.length > 0 && writingUsers.length === 0 && (
                  <span
                    className={`${styles['chat-top-section__info']} ${chatStatus === CHAT_INFO_STATUS_ONLINE ? styles['chat-top-section__info--active'] : ''}`}
                  >
                    {chatStatus}
                  </span>
                )}
                {/* если получен статус, и есть печатающие пользователи и чат негрупповой, отображать статус "печатает" без имени пользователя*/}
                {chatStatus.length > 0 &&
                  writingUsers.length > 0 &&
                  activeChatIsGroup === false && (
                    <span
                      className={`${styles['chat-top-section__info']} ${styles['chat-top-section__info--active']} ${styles['chat-top-section__info--loading']}`}
                    >
                      {CHAT_INFO_STATUS_WRITING}
                      <DotsBounceLoader />
                    </span>
                  )}
                {/* если получен статус, и есть печатающие пользователи и чат групповой, отображать статус "печатает" с именем первого в массиве пользователя*/}
                {chatStatus.length > 0 &&
                  writingUsers.length > 0 &&
                  activeChatIsGroup === true &&
                  activeChatMembers && (
                    <span
                      className={`${styles['chat-top-section__info']} ${styles['chat-top-section__info--active']}`}
                    >
                      {username.length > 0 ? (
                        <>
                          {username} {CHAT_INFO_STATUS_WRITING}
                          <DotsBounceLoader />
                        </>
                      ) : (
                        chatStatus
                      )}
                    </span>
                  )}
              </div>
              <AvatarImage animated={true} AvatarImg={avatar} />
            </>
          )}
          {isMessagesSelecting && (
            <div
              className={styles['chat-top-section__selecting-buttons-wrapper']}
            >
              <button
                onClick={onCopyBtnClick}
                className={`${styles['chat-top-section__selecting-button']} ${styles['chat-top-section__selecting-button--animated']} ${
                  messagesArray
                    .filter((message) =>
                      selectedMessages.some(
                        (selectedMessage) =>
                          selectedMessage.messageId === message.messageId,
                      ),
                    )
                    .filter((message) => message.messageText.trim() !== '')
                    .length > 0
                    ? styles['active']
                    : ''
                }`}
              >
                <CopySvg
                  className={styles['chat-top-section__selecting-icon']}
                />
              </button>
              <button
                onClick={onDeleteBtnClick}
                className={styles['chat-top-section__selecting-button']}
              >
                <DeleteSvg
                  className={styles['chat-top-section__selecting-icon']}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatTopSection;
