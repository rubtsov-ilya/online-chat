import { FC, useLayoutEffect, useRef, useState } from 'react';
import Search from 'src/components/ui/search/Search';

import styles from './ChatsListSection.module.scss';
import EmptyChatsWrapper from './empty-chats-wrapper/EmptyChatsWrapper';
import ChatItem from './chat-item/ChatItem';
import { ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbUserChat,
  } from 'src/interfaces/firebaseRealtimeDatabase.interface';
  import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface ChatsListSectionProps {
  isMobileScreen: boolean;
}

const ChatsListSection: FC<ChatsListSectionProps> = ({ isMobileScreen }) => {
  const { uid } = useAuth();
  const [chats, setChats] = useState<IFirebaseRtDbChat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean | 'error'>(true);
  const chatsListRef = useRef<HTMLDivElement | null>(null);
  const ComponentTag = isMobileScreen ? 'section' : 'div';

  useLayoutEffect(() => {
    setIsLoading(true);
    const userChatsRef = firebaseRef(firebaseDatabase, `userChats/${uid}`);

    const unsubscribeUserChats = onValue(
      userChatsRef,
      (snapshot) => {
        const userChatSnapshot: IFirebaseRtDbUserChat = snapshot.val();
        if (userChatSnapshot) {
          const chatsArray = Object.values(userChatSnapshot.chats);
          setIsLoading(false);
          setChats(chatsArray);
        }
      },
      (error) => {
        setIsLoading('error');
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
      className={`${styles['chats-list']} ${isLoading === true ? styles['chats-list--relative'] : ''}`}
    >
      <div className={'container container--height container--no-padding'}>
        <div className={styles['chats-list__content']}>
          {isLoading === true && (
            <div className={styles['chats-list__circular-progressbar-wrapper']}>
              <CircularProgressbar
                className={styles['chats-list__circular-progressbar']}
                value={66}
                styles={buildStyles({
                  // Rotation of path and trail, in number of turns (0-1)
                  /* rotation: 0.25, */
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
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
          {/* {isLoading === 'error' && <p>'Ошибка загрузки'</p>} */}
          {isLoading === false && chats?.length === 0 && <EmptyChatsWrapper />}

          {chats?.length !== 0 && (
            <>
              <div className={styles['chats-list__search-wrapper']}>
                <Search />
              </div>
              {chats.map((chatItemData, index) => {
/*                 const chatName = chatItemData.membersIds.map((id) => {
                  return id !== uid;
                });
                console.log(chatName)
                const userRef = firebaseRef(
                  firebaseDatabase,
                  `users/${chatName}`,
                );
                const userAvatarRef = ref(firebaseDatabase, `usersAvatars/${user.uid}`);
                const userSnapshot = await get(userRef); */
                return (
                  <ChatItem
                    key={index}
                    uid={uid!}
                    chatItemData={chatItemData}
                    chatsListRef={chatsListRef}
                    isMobileScreen={isMobileScreen}
                  />
                );
              })}
              {/* <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              />
              <ChatItem
                chatsListRef={chatsListRef}
                isMobileScreen={isMobileScreen}
              /> */}
            </>
          )}
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatsListSection;
