import { FC } from 'react';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatItem.module.scss';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';

interface ChatItemProps {}

const ChatItem: FC<ChatItemProps> = ({}) => {
  const userData = {
    lastMessage: 'The weather will be perfect for the stuses isisisisisi sas a',
    messageDateUTC: '2024-10-23T07:16:04.275Z',
    counter: 14,
    userName: 'Антон Арбузов',
  };

  return (
    <>
      <div className={styles['chat-item']}>
        <div className={styles['chat-item__left-wrapper']}>
          <AvatarImage AvatarImg={userAvatarImg} />
          <div className={styles['chat-item__user-details-wrapper']}>
            <span className={styles['chat-item__user-name']}>
              {userData.userName}
            </span>
            <span className={styles['chat-item__user-message']}>
              {userData.lastMessage.length > 38
                ? userData.lastMessage.slice(0, 38) + '...'
                : userData.lastMessage}
            </span>
          </div>
        </div>
        <div className={styles['chat-item__right-wrapper']}>
          <div className={styles['chat-item__counter-wrapper']}>
            <span className={styles['chat-item__counter']}>
              {userData.counter}
            </span>
          </div>
          <CheckedAndTimeStatuses
            isChecked={true}
            time={userData.messageDateUTC}
          />
        </div>
      </div>
    </>
  );
};

export default ChatItem;
