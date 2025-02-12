import { FC, useEffect, useState } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatTopSection.module.scss';
import { useNavigate } from 'react-router-dom';
import useActiveChat from 'src/hooks/useActiveChat';
import useAuth from 'src/hooks/useAuth';
import { firebaseDatabase } from 'src/firebase';
import { onValue, ref } from 'firebase/database';
import {
  CHAT_INFO_STATUS_OFFLINE,
  CHAT_INFO_STATUS_ONLINE,
  CHAT_INFO_STATUS_WRITING,
} from 'src/constants';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import DotsBounceLoader from 'src/components/ui/dots-bounce-loader/DotsBounceLoader';

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
  const { activeChatMembers, activeChatIsGroup, activeChatId } =
    useActiveChat();
  const [chatStatus, setChatStatus] = useState<string>('');
  const [writingUsers, setWritingUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  const onBackBtnClick = () => {
    navigate('/chats');
    /* dispatch(removeActiveChat()); */
  };

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
          const userIsOnlineRef = ref(
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
      const writingUsersRef = ref(
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

  // получаем имя печатющего пользователя для группового чата
  const username = activeChatIsGroup === true && activeChatMembers !== null && writingUsers.length > 0 ? activeChatMembers.find((member) => member.uid === writingUsers[0])?.username.slice(0,20) || '' : '';

  return (
    <ComponentTag className={styles['chat-top-section']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-top-section__content']}>
          <button
            onClick={onBackBtnClick}
            className={styles['chat-top-section__back-btn']}
          >
            <LeftChevronSvg
              className={styles['chat-top-section__left-chevron-svg']}
            />
          </button>
          <div className={styles['chat-top-section__middle-wrapper']}>
            <span className={styles['chat-top-section__chatname']}>{chatname}</span>
            {/* если не получен статус, отображать анимированные ... */}
            {chatStatus.length === 0 && (
              <span className={`${styles['chat-top-section__info']}`}>
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
                      {username}
                      {' '}
                      {CHAT_INFO_STATUS_WRITING}
                      <DotsBounceLoader />
                    </> 
                  ) : chatStatus}
                </span>
              )}
          </div>
          <AvatarImage AvatarImg={avatar} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatTopSection;
