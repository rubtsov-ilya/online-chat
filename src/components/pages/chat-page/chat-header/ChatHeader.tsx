import { FC, useEffect, useState } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatHeader.module.scss';
import { useNavigate } from 'react-router-dom';
import useActiveChat from 'src/hooks/useActiveChat';
import useAuth from 'src/hooks/useAuth';
import { firebaseDatabase } from 'src/firebase';
import { onValue, ref } from 'firebase/database';
import {
  CHAT_INFO_STATUS_OFFLINE,
  CHAT_INFO_STATUS_ONLINE,
} from 'src/constants';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';

interface ChatHeaderProps {
  isMobileScreen?: boolean;
  avatar: string;
  chatname: string;
  isSubscribeLoading: boolean;
  locationUid: ILocationChatPage['userUidFromGlobalSearch'] | null;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  isMobileScreen,
  avatar,
  chatname,
  isSubscribeLoading,
  locationUid,
}) => {
  const ComponentTag = isMobileScreen ? 'header' : 'div';
  const { uid } = useAuth();
  const { activeChatMembers, activeChatIsGroup } = useActiveChat();
  const [chatInfo, setChatInfo] = useState('');
  const navigate = useNavigate();

  const onBackBtnClick = () => {
    navigate('/chats');
    /* dispatch(removeActiveChat()); */
  };

  useEffect(() => {
    let unsubscribeUserIsOnline: (() => void) | undefined;

    if ((activeChatMembers !== null && activeChatIsGroup !== null) || locationUid !== null) {
      if (isSubscribeLoading === true) {
        setChatInfo('');
      } else if ((isSubscribeLoading === false && activeChatIsGroup === false) || locationUid !== null) {
        // если чат не групповой
        const otherMemberUid = activeChatMembers?.find(
          (member) => member.uid !== uid,
        )?.uid || locationUid;

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
                setChatInfo(CHAT_INFO_STATUS_OFFLINE);
              } else if (isUserOnline === true) {
                setChatInfo(CHAT_INFO_STATUS_ONLINE);
              }
            },
            (error) => {
              console.error(
                'Ошибка при получении статуса online:',
                error,
              );
            },
          );
        }
      } else if (isSubscribeLoading === false && activeChatIsGroup === true && activeChatMembers !== null) {
              // если чат групповой
        const membersCount = activeChatMembers.length;
        const membersText = 
          membersCount === 1
            ? 'участник'
            : membersCount >= 2 && membersCount <= 4
            ? 'участника'
            : 'участников';
        setChatInfo(`${membersCount} ${membersText}`);
      }
    }

    return () => {
      if (unsubscribeUserIsOnline) {
        unsubscribeUserIsOnline();
      }
    };
  }, [activeChatMembers, isSubscribeLoading, locationUid]);

  return (
    <ComponentTag className={styles['chat-header']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-header__content']}>
          <button
            onClick={onBackBtnClick}
            className={styles['chat-header__back-btn']}
          >
            <LeftChevronSvg
              className={styles['chat-header__left-chevron-svg']}
            />
          </button>
          <div className={styles['chat-header__middle-wrapper']}>
            <span className={styles['chat-header__chatname']}>{chatname}</span>
            <span className={`${styles['chat-header__info']} ${chatInfo === CHAT_INFO_STATUS_ONLINE ? styles['chat-header__info--active'] : ''} ${chatInfo.length === 0 ? styles['chat-header__info--loading'] : ''}`}>{chatInfo}</span>
          </div>
          <AvatarImage AvatarImg={avatar} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatHeader;
