import { onAuthStateChanged } from 'firebase/auth';
import { FC, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth } from 'src/firebase';
import { setUser } from 'src/redux/slices/UserSlice';
import { useGetUsersQuery } from 'src/redux';
import useAuth from 'src/hooks/useAuth';

const AuthProvider: FC = ({}) => {
  const { uMockid } = useAuth();
  const { data: users = [] } = useGetUsersQuery(undefined, {
    skip: uMockid !== null,
  });
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (users.length > 0) {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          user.getIdToken().then((token) => {
            /* dispatch(
              setUser({
                email: user.email,
                uid: user.uid,
                token: token,
                uMockid: users.find(u => u.uid === user.uid)?.mockid || null
              })
            ); */
          });
        } else {
          // User is signed out
          console.log('User is signed out');
        }
      });
    }
  }, [users]);

  return null;
};

export default AuthProvider;
