import { useContext } from 'react';
import { bodyLockContext } from 'src/providers/BodyLockProvider';

export default function useBodyLockContext() {
  const context = useContext(bodyLockContext);
  if (!context) {
    throw new Error('useBodyLockContext is null');
  }
  return context;
}
