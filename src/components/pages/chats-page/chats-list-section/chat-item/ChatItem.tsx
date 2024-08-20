import { FC } from 'react';
import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatItem.module.scss';

const ChatItem: FC = ({}) => {
  const userData = {
    lastMessage: 'The weather will be perfect for the stuses isisisisisi sas a',
    messageDate: '10:16',
    counter: '1',
    userName: 'Антон Арбузов',
  };

  return (
    <div className={styles['chat-item']}>
      <div className={styles['chat-item__left-wrapper']}>
        <AvatarImage userAvatarImg={userAvatarImg} />
        <div className={styles['chat-item__user-details-wrapper']}>
          <p className={styles['chat-item__user-name']}>{userData.userName}</p>
          <p className={styles['chat-item__user-message']}>
            {userData.lastMessage.length > 38
              ? userData.lastMessage.slice(0, 38) + '...'
              : userData.lastMessage}
          </p>
        </div>
      </div>
      <div className={styles['chat-item__right-wrapper']}>
        <div className={styles['chat-item__counter-wrapper']}>
          <span className={styles['chat-item__counter']}>
            {userData.counter}
          </span>
        </div>
        <div className={styles['chat-item__message-statuses-wrapper']}>
          <CheckedStatusSvg className={styles['chat-item__check-mark']} />
          <span className={styles['chat-item__message-date']}>
            {userData.messageDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
