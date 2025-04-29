import { FC, useLayoutEffect } from 'react';
import styles from './AddUsersSection.module.scss';

import {
  ref as refFirebaseDatabase,
  get,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import { IFirebaseRtDbChat } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import SearchUsersByName from './search-users-by-name/SearchUsersByName';

interface AddUsersSectionProps {}

const AddUsersSection: FC<AddUsersSectionProps> = ({}) => {
  const { uid } = useAuth();
  useLayoutEffect(() => {
    const userChatsRef = refFirebaseDatabase(
      firebaseDatabase,
      `userChats/${uid}/chats`,
    );

    const userChatsQuery = query(
      userChatsRef,
      orderByChild('isGroup'),
      equalTo(false),
    );

    const getUsers = async () => {
      try {
        const userChatsSnapshot = await get(userChatsQuery);

        if (userChatsSnapshot.exists()) {
          const userChatsValue = Object.values(
            userChatsSnapshot.val(),
          ) as IFirebaseRtDbChat[];
          const usersIds = userChatsValue
            .flatMap((userChat) => Object.keys(userChat.membersIds))
            .filter((memberIds) => memberIds !== uid);

          const uniqueUserIds = Array.from(new Set(usersIds));

          console.log(uniqueUserIds);

          const usersWithDetails = await Promise.all(
            usersIds.map(async (userId) => {
              const userRef = refFirebaseDatabase(
                firebaseDatabase,
                `users/${userId}`,
              );
              const userSnapshot = await get(userRef);
              const userValue = userSnapshot.val();
              return {
                uid: userValue.uid,
                username: userValue.username,
                avatar: userValue.avatar,
              };
            }),
          );

          console.log(usersWithDetails);
          // TODO и вот тут надо продумать где будет сортировка по буквам. Как будто при отрисовке. Т.к. при поиске нужен неизмененный массив.
        }
      } catch (error) {
        console.error('Ошибка получения данных пользователей:', error);
        throw error;
      }
    };

    getUsers();
  }, []);

  return (
    <section className={styles['add-users-section']}>
      <div className={'container'}>
        <div className={styles['add-users-section__content']}>
          <SearchUsersByName />
        </div>
      </div>
    </section>
  );
};

export default AddUsersSection;
