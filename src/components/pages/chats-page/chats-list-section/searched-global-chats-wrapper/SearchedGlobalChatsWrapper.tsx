import { FC } from 'react';
import styles from './SearchedGlobalChatsWrapper.module.scss';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import ChatGlobalItem from '../chat-global-item/ChatGlobalItem';

interface SearchedGlobalChatsWrapperProps {
  searchedGlobalChats: 'error' | IFirebaseRtDbUser[];
  isMobileScreen: boolean;
}
const SearchedGlobalChatsWrapper: FC<SearchedGlobalChatsWrapperProps> = ({
  searchedGlobalChats,
  isMobileScreen,
}) => {

  // отработку 'error сделать?'

  return (
    <div className={styles['searched-global-chats-wrapper']}>
      <span className={styles['searched-global-chats-wrapper__text']}>
        Глобальный поиск
      </span>
      {searchedGlobalChats !== 'error' &&
        searchedGlobalChats.map((globalChat, index) => {
          return (
            <ChatGlobalItem
              key={index}
              userUid={globalChat.uid}
              isMobileScreen={isMobileScreen}
              chatname={globalChat.username}
              chatAvatar={globalChat.avatar}
            />
          );
        })}
    </div>
  );
};

export default SearchedGlobalChatsWrapper;
