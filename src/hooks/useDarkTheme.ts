import { useContext } from "react";
import { darkThemeContext } from "../providers/DarkThemeProvider";
import { IValueDarkTheme } from "../interfaces/DarkThemeValue.interface";

const useDarkTheme = (): IValueDarkTheme => {
  const context = useContext(darkThemeContext);
  if (!context) {
    throw new Error("useDarkTheme is null");
  }
  return context;
};
export default useDarkTheme;
