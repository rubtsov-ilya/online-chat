import { useContext } from 'react';
import { IValueDarkTheme } from 'src/interfaces/DarkThemeValue.interface';
import { darkThemeContext } from 'src/providers/DarkThemeProvider';

const useDarkThemeContext = (): IValueDarkTheme => {
  const context = useContext(darkThemeContext);
  if (!context) {
    throw new Error('useDarkThemeContext is null');
  }
  return context;
};
export default useDarkThemeContext;
