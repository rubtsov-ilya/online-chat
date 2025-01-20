import { FC } from 'react';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatHeader.module.scss';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  isMobileScreen?: boolean;
  avatar: string;
  chatname: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  isMobileScreen,
  avatar,
  chatname,
}) => {
  const ComponentTag = isMobileScreen ? 'header' : 'div';
  const navigate = useNavigate();

  const onBackBtnClick = () => {
    navigate('/chats');
    /* dispatch(removeActiveChat()); */
  };

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
          <span className={styles['chat-header__chat-name']}>{chatname}</span>
          <AvatarImage AvatarImg={avatar} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatHeader;
