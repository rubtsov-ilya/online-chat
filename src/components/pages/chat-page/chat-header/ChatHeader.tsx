import { FC } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  isMobileScreen?: boolean;
}

const ChatHeader: FC<ChatHeaderProps> = ({ isMobileScreen }) => {
  const ComponentTag = isMobileScreen ? 'header' : 'div';

  return (
    <ComponentTag className={styles['chat-header']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-header__content']}>
          <button className={styles['chat-header__back-btn']}>
            <LeftChevronSvg
              className={styles['chat-header__left-chevron-svg']}
            />
          </button>
          <span className={styles['chat-header__chat-name']}>
            {'Павел Дуров'}
          </span>
          <AvatarImage AvatarImg={userAvatarImg} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatHeader;
