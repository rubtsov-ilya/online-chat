import React, { FC, createContext, useEffect, useState } from 'react';
import { IValueServerError } from 'src/interfaces/ServerErrorValue.interface';

interface ServerErrorProviderProps {
  children: React.ReactNode;
}

export const serverErrorContext = createContext<IValueServerError | null>(null);

const ServerErrorProvider: FC<ServerErrorProviderProps> = ({ children }) => {
  const [isTooManyRequestsError, setIsTooManyRequestsError] =
    useState<boolean>(false);

  useEffect(() => {
    if (isTooManyRequestsError === true) {
      console.log('Server Error.Await 20 seconds');
      const timer = setTimeout(() => {
        setIsTooManyRequestsError(false);
        console.log('20 seconds have passed');
      }, 20000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isTooManyRequestsError]);

  const setServerError = (): void => {
    if (isTooManyRequestsError === false) {
      setIsTooManyRequestsError(true);
    } else {
      return;
    }
  };

  const value: IValueServerError = { isTooManyRequestsError, setServerError };
  // get in components
  // const {isTooManyRequestsError, doServerError} = useServerError()
  return (
    <serverErrorContext.Provider value={value}>
      {children}
    </serverErrorContext.Provider>
  );
};

export default ServerErrorProvider;
