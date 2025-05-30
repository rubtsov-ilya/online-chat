import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './ChatAddUsersSection.module.scss';
import {
  GroupedUsersType,
  IUserWithDetails,
} from 'src/interfaces/UserWithDetails.interface';
import { IFirebaseRtDbChat } from 'src/interfaces/FirebaseRealtimeDatabase.interface';

import {
  ref as refFirebaseDatabase,
  get,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import SearchUsersByName from './search-users-by-name/SearchUsersByName';
import ChatInfoUserItem from 'src/components/ui/chat-info-user-item/ChatInfoUserItem';
import UserList from './user-list/UserList';
import SelectedUserList from './selected-user-list/SelectedUserList';
import NoResults from './no-results/NoResults';
import SectionLoader from './section-loader/SectionLoader';
import TopBar from './top-bar/TopBar';
import useActiveChat from 'src/hooks/useActiveChat';

interface ChatAddUsersSectionProps {
  isMobileScreen: boolean | undefined;
  closeAddUsers: () => void;
}

const ChatAddUsersSection: FC<ChatAddUsersSectionProps> = ({
  isMobileScreen,
  closeAddUsers,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = useState<IUserWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUsersType>({});
  const [selectedUsers, setSelectedUsers] = useState<IUserWithDetails[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { uid } = useAuth();
  const { activeChatMembers } = useActiveChat()

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
            .filter((memberId) => memberId !== uid && !activeChatMembers?.map((member) => member.uid).includes(memberId));

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

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => {};
  }, []);

  const onCloseBtnClick = () => {
    setIsVisible(false);
    closeAddUsers();
  };

  return (
    <section
      className={`${styles['chat-add-users-section']} ${isVisible ? styles['chat-add-users-section--visible'] : ''}`}
    >
      <TopBar onCloseBtnClick={onCloseBtnClick} isMobileScreen={isMobileScreen} selectedUsers={selectedUsers} />
      <div
        className={`container container--height container--no-padding ${isMobileScreen ? '' : 'container--max-width-unset'}`}
      >
        <div className={styles['chat-add-users-section__content']}>
          {isUsersLoading && <SectionLoader />}
          {!isUsersLoading && (
            <>
              <SearchUsersByName
                groupedUsers={groupedUsers}
                setSearchedUsers={setSearchedUsers}
                setIsSearching={setIsSearching}
              />
              {!isSearching && selectedUsers.length !== 0 && (
                <SelectedUserList
                  setSelectedUsers={setSelectedUsers}
                  sectionRef={sectionRef}
                  selectedUsers={selectedUsers}
                />
              )}

              {!isSearching && (
                <UserList
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  groupedUsers={groupedUsers}
                />
              )}
              {isSearching &&
                searchedUsers.length > 0 &&
                searchedUsers.map((user) => (
                  <ChatInfoUserItem
                    isSelectable={true}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    key={user.uid}
                    user={user}
                  />
                ))}
              {isSearching && searchedUsers.length === 0 && <NoResults />}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatAddUsersSection;
