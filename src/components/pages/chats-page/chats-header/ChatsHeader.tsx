import styles from './ChatsHeader.module.scss'
import { FC } from 'react';
import PencilBtn from 'src/components/ui/pencil-btn/PencilBtn';
import userAvatarImg from "src/assets/images/icons/dev-icons/avatar.jpg"

interface HeaderProps {
  isMobileScreen?: boolean;
}

const Header: FC<HeaderProps> = ({isMobileScreen}) => {
  const ComponentTag = isMobileScreen ? "header" : "div";

  return (
    <ComponentTag className={styles["top-bar"]}>
      <div className="container">
        <div className={styles["top-bar__content"]}>
          <img src={userAvatarImg} alt="Avatar" className={styles["top-bar__avatar"]}/>
          <h1 className={styles["top-bar__title"]}>Online Chat</h1>
          <PencilBtn />
        </div>
      </div>
    </ComponentTag>
  );
}

export default Header