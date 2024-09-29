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
    <ComponentTag className={styles['top-bar']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['top-bar__content']}>
          <button className={styles['top-bar__back-btn']}>
            <LeftChevronSvg className={styles['top-bar__left-chevron-svg']} />
          </button>
          <span className={styles['top-bar__chat-name']}>{'Павел Дуров'}</span>
          <AvatarImage AvatarImg={userAvatarImg} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatHeader;
