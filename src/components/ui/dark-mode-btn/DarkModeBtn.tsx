import { FC } from "react";
import styles from "./DarkModeBtn.module.sass";
import MoonSvg from "../../../assets/images/dark-mode-icons/moon.svg?react";
import SunSvg from "../../../assets/images/dark-mode-icons/sun.svg?react";
import useDarkTheme from "../../../hooks/useDarkTheme";

const DarkModeBtn: FC = () => {
  const {isDarkTheme, changeDarkThemeState} = useDarkTheme()
  return (
    <button onClick={changeDarkThemeState} className={styles["mode-btn"]}>
      {!isDarkTheme && <MoonSvg className={styles["moon-svg"]} />}
      {isDarkTheme && <SunSvg className={styles["sun-svg"]} />}
    </button>
  );
};

export default DarkModeBtn;
