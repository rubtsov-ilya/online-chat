import styles from './Header.module.scss'
import Logo from "../../../assets/images/home-page-icons/Logo.svg?react"
import { Link } from 'react-router-dom';
import { FC } from 'react';
import DarkModeBtn from '../../ui/dark-mode-btn/DarkModeBtn';
import useBodyLock from '../../../hooks/useBodyLock';



const Header: FC = () => {
  const { isBodyLock, lockPaddingValue } = useBodyLock()

  return (
    <header style={ isBodyLock ? { paddingRight: `${lockPaddingValue}px` } : {}} className={styles["header"]}>
      <div className="container">
        <div className={styles["header__content"]}>
          <Link to={"/"}><Logo className={styles["header__logo"]}/></Link>
          <div className={styles["header__right-wrapper"]}>
            <DarkModeBtn />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header