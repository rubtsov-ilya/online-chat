import styles from './ChatsHeader.module.scss'
import { FC } from 'react';
import PencilBtn from 'src/components/ui/pencil-btn/PencilBtn';
import useBodyLock from 'src/hooks/useBodyLock';


const Header: FC = () => {
  const { isBodyLock, lockPaddingValue } = useBodyLock()

  return (
    <header style={ isBodyLock ? { paddingRight: `${lockPaddingValue}px` } : {}} className={styles["header"]}>
      <div className="container">
        <div className={styles["header__content"]}>
          <img src="src/assets/images/icons/dev-icons/avatar.jpg" alt="Avatar" className={styles["header__avatar"]}/>
          <h1 className={styles["header__title"]}>Online Chat</h1>
          <PencilBtn />
        </div>
      </div>
    </header>
  );
}

export default Header