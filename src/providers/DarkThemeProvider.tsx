import React, { FC, createContext, useEffect, useState } from 'react';
import { IValueDarkTheme } from 'src/interfaces/DarkThemeValue.interface';

interface DarkThemeProviderProps {
  children: React.ReactNode;
}

export const darkThemeContext = createContext<IValueDarkTheme | null>(null);

const DarkThemeProvider: FC<DarkThemeProviderProps> = ({ children }) => {
  const bodyTag = document.querySelector('body') as HTMLBodyElement;
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  /* useLayoutEffect(() => {
    const isDeviceDarkTheme: boolean = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkTheme(true);
    } else if (theme === 'light') {
      setIsDarkTheme(false);
    } else if (!theme && isDeviceDarkTheme) {
      setIsDarkTheme(true);
    } else if (!theme && !isDeviceDarkTheme) {
      localStorage.setItem('theme', 'light');
    }
  }, []); */

  useEffect(() => {
    if (isDarkTheme) {
      bodyTag.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (!isDarkTheme) {
      bodyTag.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkTheme]);

  const changeDarkThemeState = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const value: IValueDarkTheme = { isDarkTheme, changeDarkThemeState };
  // получение в компонентах
  // const {isDarkTheme, changeDarkThemeState} = useDarkThemeContext()
  return (
    <darkThemeContext.Provider value={value}>
      {children}
    </darkThemeContext.Provider>
  );
};

export default DarkThemeProvider;
