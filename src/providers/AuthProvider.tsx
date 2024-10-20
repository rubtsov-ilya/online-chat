import { onAuthStateChanged } from 'firebase/auth';
import { FC, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth } from 'src/firebase';
import { setUser } from 'src/redux/slices/UserSlice';

const AuthProvider: FC = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          dispatch(
            setUser({
              email: user.email,
              uid: user.uid,
              token: token,
            }),
          );
        });
      } else {
        // User is signed out
        console.log('User is signed out');
      }
    });
  }, []);

  return null;
};

export default AuthProvider;
