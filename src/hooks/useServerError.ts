import { useContext } from 'react';

import { serverErrorContext } from '../providers/ServerErrorProvider';

import { IValueServerError } from './../interfaces/ServerErrorValue.interface';

const useServerError = (): IValueServerError => {
  const context = useContext(serverErrorContext);
  if (!context) {
    throw new Error('useServerError is null');
  }
  return context;
};
export default useServerError;
