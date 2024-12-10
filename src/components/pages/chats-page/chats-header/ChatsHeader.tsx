import { FC } from 'react';
import PencilBtn from 'src/components/ui/pencil-btn/PencilBtn';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatsHeader.module.scss';
import useAuth from 'src/hooks/useAuth';

interface HeaderProps {
  isMobileScreen: boolean;
}

const Header: FC<HeaderProps> = ({ isMobileScreen }) => {
  const { avatar } = useAuth();
  const ComponentTag = isMobileScreen ? 'header' : 'div';

  return (
    <ComponentTag className={styles['top-bar']}>
      <div className="container">
        <div className={styles['top-bar__content']}>
          <AvatarImage AvatarImg={avatar!} />
          <h1 className={styles['top-bar__title']}>Online Chat</h1>
          <PencilBtn isMobileScreen={isMobileScreen} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default Header;
