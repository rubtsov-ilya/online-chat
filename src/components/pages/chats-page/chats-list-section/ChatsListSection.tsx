import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatsListSection.module.scss';
import { ref as refFirebaseDatabase, onValue, get, off } from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import EmptyChatsWrapper from './empty-chats-wrapper/EmptyChatsWrapper';
import ChatItem from './chat-item/ChatItem';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbUser,
  IFirebaseRtDbUserChat,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ErrorChatsWrapper from './error-chats-wrapper/ErrorChatsWrapper';

import SearchChatsByName from './search-chats-by-name/SearchChatsByName';
import SearchedGlobalChatsWrapper from './searched-global-chats-wrapper/SearchedGlobalChatsWrapper';

import SearchedChatsWrapper from './searched-chats-wrapper/SearchedChatsWrapper';
import {
  IChatWithDetails,
  IMemberDetails,
} from 'src/interfaces/ChatsWithDetails.interface';
import {
  CIRCULAR_LOADING_PERCENT_VALUE,
  USERNAME_DEFAULT_VALUE,
  USER_AVATAR_DEFAULT_VALUE,
} from 'src/constants';
import useActiveChat from 'src/hooks/useActiveChat';

interface ChatsListSectionProps {
  isMobileScreen: boolean;
}

const ChatsListSection: FC<ChatsListSectionProps> = ({ isMobileScreen }) => {
  const { uid, avatar, username, blocked } = useAuth();
/*   const {
    activeChatId,
    activeChatAvatar,
    activeChatBlocked,
    activeChatname,
    activeChatMembers,
    activeChatIsGroup,
  } = useActiveChat();
  console.log(
    'activeChatId',
    activeChatId,
    'activeChatAvatar',
    activeChatAvatar,
    'activeChatBlocked',
    activeChatBlocked,
    'activeChatname',
    activeChatname,
    'activeChatMembers',
    activeChatMembers,
    'activeChatIsGroup',
    activeChatIsGroup,
  ); */
  const [chats, setChats] = useState<IFirebaseRtDbChat[]>([]);
  const [chatsWithDetails, setChatsWithDetails] = useState<IChatWithDetails[]>(
    [],
  );
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [searchedGlobalChats, setSearchedGlobalChats] = useState<
    IFirebaseRtDbUser[]
  >([]);
  const [searchedChats, setSearchedChats] = useState<IChatWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false); // состояние использования поиска
  const [isLoading, setIsLoading] = useState<boolean>(false); // состояние загрузки пользователей из глобального поиска
  const [isChatsLoading, setIsChatsLoading] = useState<boolean | 'error'>(
    false,
  );
  const chatsListRef = useRef<HTMLDivElement | null>(null);
  const ComponentTag = isMobileScreen ? 'section' : 'div';

  useLayoutEffect(() => {
    setIsChatsLoading(true);
    const userChatsRef = refFirebaseDatabase(
      firebaseDatabase,
      `userChats/${uid}`,
    );

    const unsubscribeUserChats = onValue(
      userChatsRef,
      (snapshot) => {
        const userChatsSnapshotValue: IFirebaseRtDbUserChat = snapshot.val();
        if (userChatsSnapshotValue) {
          if ('chats' in userChatsSnapshotValue) {
            const chatsArray = Object.values(userChatsSnapshotValue.chats);
            setChats(chatsArray);
          } else {
            setIsChatsLoading(false);
          }
        }
      },
      (error) => {
        setIsChatsLoading('error');
        console.error('Error fetching username:', error);
      },
    );

    return () => {
      unsubscribeUserChats();
    };
  }, []);

  useLayoutEffect(() => {
    const getChatsWithDetails = async () => {
      if (chats.length > 0) {
        try {
          const existingChatIds = new Set(
            chatsWithDetails.map((chat) => chat.chatId),
          );

          const filteredChats = chats.filter((chat) => 'membersIds' in chat);

          const newChats: IChatWithDetails[] = await Promise.all(
            filteredChats.map(async (chat) => {
              // если чат уже существует, обновить только измененные ключи, оставляя username и avatar
              if (existingChatIds.has(chat.chatId)) {
                const existingChat = chatsWithDetails.find(
                  (c) => c.chatId === chat.chatId,
                )!;
                return {
                  ...chat,
                  membersDetails: existingChat.membersDetails,
                };
              }

              const membersDetails: (IMemberDetails | null)[] =
                await Promise.all(
                  Object.keys(chat.membersIds).map(async (memberId) => {
                    if (memberId === uid) {
                      // Для текущего пользователя
                      return {
                        uid: memberId,
                        username: username as string,
                        avatar: avatar as string,
                        blocked: blocked as string[],
                      };
                    } else {
                      // если чат групповой, то не делать запрос на объект. Эти данные получатся в самом чате при его открытии
                      // blocked устанавливаются в подписку в самом чате при его открытии
                      if (chat.isGroup === true) return null;

                      // Для других участников
                      try {
                        const userRef = refFirebaseDatabase(
                          firebaseDatabase,
                          `users/${memberId}`,
                        );
                        const userSnapshot = await get(userRef);

                        if (userSnapshot.exists()) {
                          const userValue =
                            userSnapshot.val() as IFirebaseRtDbUser;
                          return {
                            uid: memberId,
                            username:
                              userValue.username || USERNAME_DEFAULT_VALUE,
                            avatar:
                              userValue.avatar || USER_AVATAR_DEFAULT_VALUE,
                            blocked: [],
                          };
                        } else {
                          return {
                            uid: memberId,
                            username: USERNAME_DEFAULT_VALUE,
                            avatar: USER_AVATAR_DEFAULT_VALUE,
                            blocked: [],
                          };
                        }
                      } catch (error) {
                        console.error(
                          `Ошибка при получении данных для пользователя ${memberId}:`,
                          error,
                        );
                        return {
                          uid: memberId,
                          username: USERNAME_DEFAULT_VALUE,
                          avatar: USER_AVATAR_DEFAULT_VALUE,
                          blocked: [],
                        };
                      }
                    }
                  }),
                );

              const filteredMembersDetails: IMemberDetails[] =
                membersDetails.filter((member): member is IMemberDetails => {
                  return member !== null;
                });

              return {
                ...chat,
                membersDetails: filteredMembersDetails,
              };
            }),
          );

          // сортировать чаты по `lastMessageDateUTC`
          const sortedChats = newChats.sort((a, b) => {
            const dateA = new Date(a.lastMessageDateUTC as number).getTime();
            const dateB = new Date(b.lastMessageDateUTC as number).getTime();
            return dateB - dateA; // Сортировка по убыванию (последние сообщения первыми)
          });

          setChatsWithDetails(sortedChats);
          setIsChatsLoading(false);
        } catch (error) {
          setIsChatsLoading('error');
          console.error('Error getting chats with details:', error);
        }
      }
    };

    getChatsWithDetails();
  }, [chats]);

  useEffect(() => {
    if (uid === null || chats.length === 0) return;

    const subscriptions: (() => void)[] = [];

    chats.forEach((chat) => {
      const unreadRef = refFirebaseDatabase(firebaseDatabase, `chats/${chat.chatId}/unreadMessages/${uid}`);

      const unsubscribeUnread = onValue(unreadRef, (snapshot) => {
        const unreadMessages = snapshot.val() || {};
        const unreadCount = Object.keys(unreadMessages).length;

        setUnreadCounts((prev) => ({
          ...prev,
          [chat.chatId]: unreadCount,
        }));
      });

      subscriptions.push(() => off(unreadRef, "value", unsubscribeUnread));
    });

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid, chats]);

  return (
    <ComponentTag
      ref={chatsListRef}
      className={`${styles['chats-list']} ${isChatsLoading === true ? styles['chats-list--relative'] : ''}`}
    >
      <div className={'container container--height container--no-padding'}>
        <div className={styles['chats-list__content']}>
          {isChatsLoading === true && (
            <div className={styles['chats-list__circular-progressbar-wrapper']}>
              <CircularProgressbar
                className={styles['chats-list__circular-progressbar']}
                value={CIRCULAR_LOADING_PERCENT_VALUE}
                styles={buildStyles({
                  // can use 'butt' or 'round'
                  strokeLinecap: 'round',
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 0.5,
                  // Colors
                  pathColor: 'var(--base-accent-blue)',
                  /* textColor: '#f88', */
                  trailColor: 'none',
                })}
              />
            </div>
          )}

          {isChatsLoading === 'error' && <ErrorChatsWrapper />}
          {isChatsLoading === false && (
            <>
              <div className={styles['chats-list__search-wrapper']}>
                <SearchChatsByName
                  isLoading={isLoading}
                  isSearching={isSearching}
                  setIsLoading={setIsLoading}
                  setIsSearching={setIsSearching}
                  setSearchedChats={setSearchedChats}
                  setSearchedGlobalChats={setSearchedGlobalChats}
                  chatsWithDetails={chatsWithDetails}
                />
              </div>
              {chatsWithDetails?.length === 0 && isSearching === false && (
                <EmptyChatsWrapper text={'Начните общаться!'} />
              )}
              <div
                className={`${styles['chats-list__chats-wrapper']} ${isSearching ? styles['chats-list__chats-wrapper--is-searching'] : ''}`}
              >
                {chatsWithDetails?.length !== 0 &&
                  isSearching === false &&
                  chatsWithDetails.map((chat, index) => {
                    // Выбираем пользователя из membersDetails, чей uid не равен текущему uid, нужно, если чат не групповой
                    const otherMember =
                      chat.isGroup === false
                        ? chat.membersDetails.find(
                            (member) => member.uid !== uid,
                          )!
                        : null;

                    if (!('chatId' in chat)) {
                      return null // защита от крашнутых чатов
                    }

                    return (
                      <ChatItem
                        key={index}
                        uid={uid!}
                        uncheckedCount={unreadCounts[`${chat.chatId}`]}
                        chatItemData={chat}
                        chatsListRef={chatsListRef}
                        isMobileScreen={isMobileScreen}
                        chatname={
                          otherMember === null
                            ? chat.groupChatname
                            : otherMember.username
                        }
                        chatAvatar={
                          otherMember === null
                            ? chat.groupAvatar
                            : otherMember.avatar
                        }
                      />
                    );
                  })}
                {isSearching === true && searchedChats.length > 0 && (
                  <SearchedChatsWrapper
                    unreadCounts={unreadCounts}
                    uid={uid}
                    isMobileScreen={isMobileScreen}
                    chatsListRef={chatsListRef}
                    searchedChats={searchedChats}
                  />
                )}
                {isSearching === true && searchedGlobalChats.length > 0 && (
                  <SearchedGlobalChatsWrapper
                    isMobileScreen={isMobileScreen}
                    searchedGlobalChats={searchedGlobalChats}
                  />
                )}
              </div>
              {isSearching === true &&
                isLoading === false &&
                searchedGlobalChats.length === 0 &&
                searchedChats.length === 0 && (
                  <EmptyChatsWrapper text={'Нет результатов'} />
                )}
            </>
          )}
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatsListSection;
