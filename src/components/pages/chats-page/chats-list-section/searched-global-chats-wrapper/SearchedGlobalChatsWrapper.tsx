import { FC } from 'react';
import styles from './SearchedGlobalChatsWrapper.module.scss';
import { IFirebaseRtDbUser } from 'src/interfaces/firebaseRealtimeDatabase.interface';
import ChatGlobalItem from '../chat-global-item/ChatGlobalItem';

interface SearchedGlobalChatsWrapperProps {
  searchedGlobalChats: 'error' | IFirebaseRtDbUser[];
  isMobileScreen: boolean;
}
const SearchedGlobalChatsWrapper: FC<SearchedGlobalChatsWrapperProps> = ({
  searchedGlobalChats,
  isMobileScreen,
}) => {
  console.log(searchedGlobalChats);

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
              isMobileScreen={isMobileScreen}
              chatName={globalChat.username}
              chatAvatar={globalChat.avatar}
            />
          );
        })}
    </div>
  );
};

export default SearchedGlobalChatsWrapper;
