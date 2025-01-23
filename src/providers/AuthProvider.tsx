import { User, onAuthStateChanged } from 'firebase/auth';
import { FC, createContext, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { firebaseAuth, firebaseDatabase } from 'src/firebase';
import { setUser } from 'src/redux/slices/UserSlice';
import { get, onDisconnect, onValue, ref, update } from 'firebase/database';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import { USER_AVATAR_DEFAULT_VALUE } from 'src/constants';
import { IValueAuth } from 'src/interfaces/AuthValue.interface';
import { FirebaseError } from 'firebase/app';
import useNormalizedUsername from 'src/hooks/useNormalizedUsername';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const authContext = createContext<IValueAuth | null>(null);

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [registerUsername, setRegisterUsername] = useState<string | null>(null);
  const dispatch = useDispatch();

  const checkAndCreateMissingUserData = async (user: User) => {
    const userRef = `users/${user.uid}`;
    const userChatsRef = `userChats/${user.uid}`;

    const userEmailPrefix = useNormalizedUsername( user
      .email!.split('@')[0]) // username без пробелов и в нижнем регистре

    const updates: Record<string, any> = {};
    const existingData: { userExist: boolean; userChatsExist: boolean } = {
      userExist: false,
      userChatsExist: false,
    };

    // проверка наличия данных в users
    const userSnapshot = await get(ref(firebaseDatabase, userRef));
    if (!userSnapshot.exists()) {
      // если данных нет, добавляем данные пользователя в updates
      updates[userRef] = {
        uid: user.uid,
        email: user.email,
        isOnline: false,
        username: userEmailPrefix, // создаётся username на основе данных с формы или email
        usernameNormalized: userEmailPrefix,
        avatar: USER_AVATAR_DEFAULT_VALUE,
      };
    } else if (userSnapshot.exists()) {
      existingData.userExist = true;
    }

    // проверка наличия userChats
    const userChatsSnapshot = await get(ref(firebaseDatabase, userChatsRef));
    if (!userChatsSnapshot.exists()) {
      // если данных нет, добавляем данные userChats в updates
      updates[userChatsRef] = {
        uid: user.uid,
      };
    } else if (userChatsSnapshot.exists()) {
      existingData.userChatsExist = true;
    }

    // если есть данные для обновления, выполняем update
    if (Object.keys(updates).length > 0) {
      await update(ref(firebaseDatabase), updates);
      return true; // вернуть true, если пользователь был создан / восстановлены потерянные данные
    }
    // если данные в database уже имеются, сохраняем в localstorage, чтобы не вызывать get функции повторно на клиенте
    if (
      existingData.userChatsExist === true &&
      existingData.userExist === true
    ) {
      localStorage.setItem('existingDataByUser', `${user.uid}`);
    }
    return false; // вернуть false, если обновления не потребовались
  };

  const updateUsernameDuringRegistration = (user: User, username: string) => {
    if (!registerUsername) {
      console.log('No registerUsername.');
      return;
    }
    const userRef = ref(firebaseDatabase, `users/${user.uid}`);
    // Обновляем только поля username и usernameNormalized
    const updates = {
      username: username,
      usernameNormalized: useNormalizedUsername(username),
    };

    update(userRef, updates);
    setRegisterUsername(null);
  };

  useLayoutEffect(() => {
    let unsubscribeUser: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        //если uid в localstorage не имеется и не совпадает с user.uid, выполнять функцию проверки и создания недостающих данных
        const existingDataByUser = localStorage.getItem('existingDataByUser');

        if (existingDataByUser == null || existingDataByUser !== user.uid) {
          try {
            const dataUpdated = await checkAndCreateMissingUserData(user);
            if (dataUpdated && registerUsername) {
              // обновить username после регистрации. dataUpdated сохранит в себе значение true, после повторной активации эффекта из-за зависимости registerUsername
              await updateUsernameDuringRegistration(user, registerUsername);
            }
          } catch (error) {
            console.error('Error in checkAndCreateMissingUserData:', error);
          }
        }

        const userRef = ref(firebaseDatabase, `users/${user.uid}`);

        update(userRef, { isOnline: true }); // установка статуса онлайн
        onDisconnect(userRef).update({ isOnline: false }); // установка статуса оффлайн

        unsubscribeUser = onValue(
          userRef,
          (snapshot) => {
            const userSnapshot: IFirebaseRtDbUser = snapshot.val();
            if (userSnapshot) {
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
            // если возникает ошибка, связанная с правами доступа
            if (
              error instanceof FirebaseError &&
              error?.code === 'PERMISSION_DENIED' &&
              unsubscribeUser
            ) {
              unsubscribeUser(); // Отключаем подписку
              unsubscribeUser = null; // Обнуляем, чтобы исключить повторные вызовы
            }
          },
        );
      } else {
        console.log('User is signed out');
      }
    });

    // очистка подписок на изменение
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }
      unsubscribeAuth();
    };
  }, [registerUsername]);

  const value: IValueAuth = { setRegisterUsername };
  // получение в компонентах
  // const { setRegisterUsername } = useAuthContext()

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export default AuthProvider;
