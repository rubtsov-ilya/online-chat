import { FC, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatsListSection.module.scss';
import { ref as refFirebaseDatabase, onValue, get } from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import EmptyChatsWrapper from './empty-chats-wrapper/EmptyChatsWrapper';
import ChatItem from './chat-item/ChatItem';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbUser,
  IFirebaseRtDbUserChat,
} from 'src/interfaces/firebaseRealtimeDatabase.interface';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ErrorChatsWrapper from './error-chats-wrapper/ErrorChatsWrapper';

import SearchChatsByName from './search-chats-by-name/SearchChatsByName';
import SearchedGlobalChatsWrapper from './searched-global-chats-wrapper/SearchedGlobalChatsWrapper';

import SearchedChatsWrapper from './searched-chats-wrapper/SearchedChatsWrapper';
import {
  IChatWithDetails,
  IMemberDetails,
} from 'src/interfaces/chatsWithDetails.interface';

interface ChatsListSectionProps {
  isMobileScreen: boolean;
}

const ChatsListSection: FC<ChatsListSectionProps> = ({ isMobileScreen }) => {
  const { uid, avatar, username, blocked } = useAuth();
  const [chats, setChats] = useState<IFirebaseRtDbChat[]>([]);
  const [chatsWithDetails, setChatsWithDetails] = useState<IChatWithDetails[]>(
    [],
  );
  /*   const [searchedChats, setSearchedChats] = useState<IFirebaseRtDbChat[]>([]); */
  const [searchedGlobalChats, setSearchedGlobalChats] = useState<
    IFirebaseRtDbUser[] | 'error'
  >([]);
  const [searchedChats, setSearchedChats] = useState<IChatWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isChatsLoading, setIsChatsLoading] = useState<boolean | 'error'>(
    'error',
  );
  const chatsListRef = useRef<HTMLDivElement | null>(null);
  const ComponentTag = isMobileScreen ? 'section' : 'div';

  useLayoutEffect(() => {
    // поиск и фильтрация - по своим чатам поиска
    setIsChatsLoading(true);
    const userChatsRef = refFirebaseDatabase(
      firebaseDatabase,
      `userChats/${uid}`,
    );

    const unsubscribeUserChats = onValue(
      userChatsRef,
      (snapshot) => {
        const userChatsSnapshot: IFirebaseRtDbUserChat = snapshot.val();
        if (userChatsSnapshot) {
          const chatsArray = Object.values(userChatsSnapshot.chats);
          setChats(chatsArray);
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
      if (chats.length > 0 && uid !== null) {
        try {
          const existingChatIds = new Set(
            chatsWithDetails.map((chat) => chat.chatId),
          );

          const newChats: IChatWithDetails[] = await Promise.all(
            chats.map(async (chat) => {
              // если чат уже существует, обновить только измененные ключи, оставляя username и userAvatar
              if (existingChatIds.has(chat.chatId)) {
                const existingChat = chatsWithDetails.find(
                  (c) => c.chatId === chat.chatId,
                )!;
                return {
                  ...chat,
                  membersDetails: existingChat.membersDetails,
                };
              }

              const membersDetails: IMemberDetails[] = await Promise.all(
                chat.membersIds.map(async (memberId) => {
                  if (memberId === uid) {
                    // Для текущего пользователя
                    return {
                      uid: memberId,
                      username: username as string,
                      avatar: avatar as string,
                      blocked: blocked as string[],
                    };
                  } else {
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
                            userValue.username || 'Неизвестный пользователь',
                          avatar: userValue.avatar || '',
                          blocked: userValue.blocked || [],
                        };
                      } else {
                        return {
                          uid: memberId,
                          username: 'Неизвестный пользователь',
                          avatar: '',
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
                        username: 'Неизвестный пользователь',
                        avatar: '',
                        blocked: [],
                      };
                    }
                  }
                }),
              );

              return {
                ...chat,
                membersDetails,
              };
            }),
          );
          setChatsWithDetails(newChats);
          setIsChatsLoading(false);
        } catch (error) {
          setIsChatsLoading('error');
          console.error('Error getting chats with details:', error);
        }
      }
    };

    getChatsWithDetails();
  }, [chats]);

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
                value={66}
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
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  setSearchedChats={setSearchedChats}
                  setSearchedGlobalChats={setSearchedGlobalChats}
                  chatsWithDetails={chatsWithDetails}
                />
              </div>
              {chatsWithDetails?.length === 0 && isSearching === false && (
                <EmptyChatsWrapper />
              )}
              <div
                className={`${styles['chats-list__chats-wrapper']} ${isSearching ? styles['chats-list__chats-wrapper--is-searching'] : ''}`}
              >
                {chatsWithDetails?.length !== 0 &&
                  isSearching === false &&
                  chatsWithDetails.map((chatItemData, index) => {
                    // не отрисовывать удалённый чат, если поиск неактивен
                    if (
                      chatItemData.isDeleted === true &&
                      isSearching === false
                    ) {
                      return null;
                    }

                    // Выбираем пользователя из membersDetails, чей uid не равен текущему uid, нужно, если чат не групповой
                    const otherMember =
                      chatItemData.groupChatname.length === 0 &&
                      chatItemData.membersDetails.length === 2 &&
                      chatItemData.membersDetails.find(
                        (member) => member.uid !== uid,
                      )!;

                    return (
                      <ChatItem
                        key={index}
                        chatItemData={chatItemData}
                        chatsListRef={chatsListRef}
                        isMobileScreen={isMobileScreen}
                        chatName={
                          otherMember === false
                            ? chatItemData.groupChatname
                            : otherMember.username
                        }
                        chatAvatar={
                          otherMember === false
                            ? chatItemData.groupAvatar
                            : otherMember?.avatar
                        }
                      />
                    );
                  })}
                {isSearching === true && searchedChats.length > 0 && (
                  <SearchedChatsWrapper
                    uid={uid}
                    isMobileScreen={isMobileScreen}
                    chatsListRef={chatsListRef}
                    searchedChats={searchedChats}
                  />
                )}
                {isSearching === true && searchedGlobalChats.length > 0 && (
                  <SearchedGlobalChatsWrapper
                    searchedGlobalChats={searchedGlobalChats}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatsListSection;
