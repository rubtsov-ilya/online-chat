import { FC, useLayoutEffect, useState } from 'react';
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
import {
  GroupedUsersType,
  IUserWithDetails,
} from 'src/interfaces/UserWithDetails.interface';
import SectionLoader from './section-loader/SectionLoader';
import UserList from './user-list/UserList';
import CreateGroupUserItem from 'src/components/ui/create-group-user-item/CreateGroupUserItem';
import EmptyChatsWrapper from '../../chats-page/chats-list-section/empty-chats-wrapper/EmptyChatsWrapper';
import NoResults from './no-results/NoResults';

interface AddUsersSectionProps {
  isMobileScreen: boolean;
}

const AddUsersSection: FC<AddUsersSectionProps> = ({ isMobileScreen }) => {
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = useState<IUserWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUsersType>({});
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
      setIsUsersLoading(true);
      try {
        const userChatsSnapshot = await get(userChatsQuery);

        if (userChatsSnapshot.exists()) {
          const userChatsValue = Object.values(
            userChatsSnapshot.val(),
          ) as IFirebaseRtDbChat[];
          const usersIds = userChatsValue
            .flatMap((userChat) => Object.keys(userChat.membersIds))
            .filter((memberIds) => memberIds !== uid);

          const usersWithDetails: IUserWithDetails[] = await Promise.all(
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

          const priorityOrder = {
            russianLetters: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
            englishLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            digits: '0123456789'.split(''),
            symbols: '~`!@#$%^&*()-_=+[]{}|;:",.<>?/\\\' '.split(''),
          };

          // Функция для определения приоритета символа
          function getPriority(char: string) {
            if (priorityOrder.russianLetters.includes(char)) return 1;
            if (priorityOrder.englishLetters.includes(char)) return 2;
            if (priorityOrder.digits.includes(char)) return 3;
            if (priorityOrder.symbols.includes(char)) return 4;
            return 5; // Для неизвестных символов
          }

          // Сортировка пользователей
          const sortedUsers = usersWithDetails.sort((a, b) => {
            const firstCharA = a.username[0].toUpperCase();
            const firstCharB = b.username[0].toUpperCase();

            const priorityA = getPriority(firstCharA);
            const priorityB = getPriority(firstCharB);

            if (priorityA !== priorityB) {
              return priorityA - priorityB; // Сначала по приоритету
            }

            // Если приоритет одинаковый, сортируем по алфавиту
            return a.username.localeCompare(b.username, 'ru-en', {
              sensitivity: 'base', // Игнорировать регистр: "Иван" = "иван"
            });
          });

          const groupedUsers = sortedUsers.reduce((acc, user) => {
            const firstChar = user.username[0].toUpperCase();
            if (!acc[firstChar]) {
              acc[firstChar] = [];
              acc[firstChar].push(user);
            } else {
              acc[firstChar].push(user);
            }

            return acc;
          }, {} as GroupedUsersType);

          setGroupedUsers(groupedUsers);
        }
      } catch (error) {
        console.error('Ошибка получения данных пользователей:', error);
        throw error;
      } finally {
        setIsUsersLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <section className={styles['add-users-section']}>
      <div
        className={`container container--height ${isMobileScreen ? 'container--no-padding' : ''}`}
      >
        <div className={styles['add-users-section__content']}>
          {isUsersLoading && <SectionLoader />}
          {!isUsersLoading && (
            <>
              <SearchUsersByName
                groupedUsers={groupedUsers}
                setSearchedUsers={setSearchedUsers}
                setIsSearching={setIsSearching}
              />
              {!isSearching && <UserList groupedUsers={groupedUsers} />}
              {isSearching && searchedUsers.length > 0 &&
                searchedUsers.map((user) => (
                  <CreateGroupUserItem key={user.uid} user={user} />
                ))}
              {isSearching && searchedUsers.length === 0 && <NoResults /> }
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddUsersSection;
