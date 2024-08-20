import { useContext } from 'react';
import { IValueDarkTheme } from 'src/interfaces/DarkThemeValue.interface';
import { darkThemeContext } from 'src/providers/DarkThemeProvider';

const useDarkTheme = (): IValueDarkTheme => {
  const context = useContext(darkThemeContext);
  if (!context) {
    throw new Error('useDarkTheme is null');
  }
  return context;
};
export default useDarkTheme;
