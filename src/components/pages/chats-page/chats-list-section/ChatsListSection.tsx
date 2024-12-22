import { FC, useDeferredValue, useLayoutEffect, useRef, useState } from 'react';

import styles from './ChatsListSection.module.scss';
import { ref as firebaseRef, onValue } from 'firebase/database';
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

interface ChatsListSectionProps {
  isMobileScreen: boolean;
}

const ChatsListSection: FC<ChatsListSectionProps> = ({ isMobileScreen }) => {
  const { uid } = useAuth();
  const [chats, setChats] = useState<IFirebaseRtDbChat[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const deferredSearchInputValue = useDeferredValue(searchInputValue);
  /*   const [searchedChats, setSearchedChats] = useState<IFirebaseRtDbChat[]>([]); */
  const [searchedGlobalChats, setSearchedGlobalChats] = useState<
    IFirebaseRtDbUser[] | 'error'
  >([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isChatsLoading, setIsChatsLoading] = useState<boolean | 'error'>(
    'error',
  );
  const chatsListRef = useRef<HTMLDivElement | null>(null);
  const ComponentTag = isMobileScreen ? 'section' : 'div';

  useLayoutEffect(() => {
    /* поиск и фильтрация - по своим чатам поиска */
    setIsChatsLoading(true);
    const userChatsRef = firebaseRef(firebaseDatabase, `userChats/${uid}`);

    const unsubscribeUserChats = onValue(
      userChatsRef,
      (snapshot) => {
        const userChatSnapshot: IFirebaseRtDbUserChat = snapshot.val();
        if (userChatSnapshot) {
          const chatsArray = Object.values(userChatSnapshot.chats);
          setIsChatsLoading(false);
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
                  deferredSearchInputValue={deferredSearchInputValue}
                  setSearchInputValue={setSearchInputValue}
                  searchInputValue={searchInputValue}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  setSearchedGlobalChats={setSearchedGlobalChats}
                />
              </div>
              {chats?.length === 0 && isSearching === false && (
                <EmptyChatsWrapper />
              )}
              <div className={`${styles['chats-list__chats-wrapper']} ${isSearching ? styles['chats-list__chats-wrapper--is-searching'] : ''}`}>
              {chats?.length !== 0 &&
                  chats.map((chatItemData, index) => {
                    return (
                      <>
                        <ChatItem
                          key={index}
                          uid={uid!}
                          index={index}
                          deferredSearchInputValue={deferredSearchInputValue}
                          chatItemData={chatItemData}
                          chatsListRef={chatsListRef}
                          isMobileScreen={isMobileScreen}
                        />
                      </>
                    );
                  })}
                {isSearching === true && (
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
