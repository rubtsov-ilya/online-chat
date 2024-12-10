import { FC } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  isMobileScreen?: boolean;
  avatar: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({ isMobileScreen, avatar }) => {
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
          <AvatarImage AvatarImg={avatar} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatHeader;
