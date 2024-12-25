import { User, onAuthStateChanged } from 'firebase/auth';
import { FC, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth, firebaseDatabase } from 'src/firebase';
import {
  setUser,
} from 'src/redux/slices/UserSlice';
import { get, onValue, ref, set } from 'firebase/database';
import { IFirebaseRtDbUser } from 'src/interfaces/firebaseRealtimeDatabase.interface';

const AuthProvider: FC = () => {
  const dispatch = useDispatch();

  const checkAndCreateMissingData = async (user: User) => {
    const userEmailPrefix = user.email!.split('@')[0].toLowerCase(); // username без пробелов и в нижнем регистре
    const userRef = ref(firebaseDatabase, `users/${user.uid}`);
    const userChatsRef = ref(firebaseDatabase, `userChats/${user.uid}`);

    // Проверка наличия данных в users
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      // Если данных нет, создаём пользователя
      await set(userRef, {
        uid: user.uid,
        email: user.email,
        username: userEmailPrefix, // Создаём username на основе email
        avatar: '',
      });
    }
    /* проверка наличия userChats */
    const userChatsSnapshot = await get(userChatsRef);
    if (!userChatsSnapshot.exists()) {
      set(userChatsRef, {
        uid: user.uid,
      });
    }
  };

  useLayoutEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        await checkAndCreateMissingData(user);
        const userRef = ref(firebaseDatabase, `users/${user.uid}`);

        const unsubscribeUser = onValue(
          userRef,
          (snapshot) => {
            const userSnapshot: IFirebaseRtDbUser = snapshot.val();
            if (userSnapshot) {
              // Если user изменился, обновляем данные пользователя в Redux
              dispatch(
                setUser({
                  email: user.email,
                  uid: user.uid,
                  avatar: userSnapshot.avatar,
                  username: userSnapshot.username,
                  blocked: userSnapshot.blocked ? userSnapshot.blocked : [],
                }),
              );
            }
          },
          (error) => {
            console.error('Error fetching username:', error);
          },
        );

        // очистка подписок на изменение 
        return () => {
          unsubscribeUser();
        };
      } else {
        console.log('User is signed out');
      }
    });

    // очистка подписок на изменение
    return () => unsubscribeAuth();
  }, []);

  return null;
};

export default AuthProvider;
