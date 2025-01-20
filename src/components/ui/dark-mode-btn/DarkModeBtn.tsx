import { FC } from 'react';

import MoonSvg from '../../../assets/images/dark-mode-icons/moon.svg?react';
import SunSvg from '../../../assets/images/dark-mode-icons/sun.svg?react';

import styles from './DarkModeBtn.module.sass';
import useDarkThemeContext from '../../../hooks/useDarkThemeContext';

const DarkModeBtn: FC = () => {
  const { isDarkTheme, changeDarkThemeState } = useDarkThemeContext();
  return (
    <button onClick={changeDarkThemeState} className={styles['mode-btn']}>
      {!isDarkTheme && <MoonSvg className={styles['moon-svg']} />}
      {isDarkTheme && <SunSvg className={styles['sun-svg']} />}
    </button>
  );
};

export default DarkModeBtn;
