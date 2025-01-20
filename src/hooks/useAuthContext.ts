import { useContext } from 'react';
import { IValueAuth } from 'src/interfaces/AuthValue.interface';
import { authContext } from 'src/providers/AuthProvider';

const useAuthContext = (): IValueAuth => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuthContext is null');
  }
  return context;
};
export default useAuthContext;
