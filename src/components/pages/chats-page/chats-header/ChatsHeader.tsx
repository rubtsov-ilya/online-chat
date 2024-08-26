import { FC } from 'react';
import PencilBtn from 'src/components/ui/pencil-btn/PencilBtn';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatsHeader.module.scss';

interface HeaderProps {
  isMobileScreen?: boolean;
}

const Header: FC<HeaderProps> = ({ isMobileScreen }) => {
  const ComponentTag = isMobileScreen ? 'header' : 'div';

  return (
    <ComponentTag className={styles['top-bar']}>
      <div className="container">
        <div className={styles['top-bar__content']}>
          <AvatarImage AvatarImg={userAvatarImg} />
          <h1 className={styles['top-bar__title']}>Online Chat</h1>
          <PencilBtn />
        </div>
      </div>
    </ComponentTag>
  );
};

export default Header;
