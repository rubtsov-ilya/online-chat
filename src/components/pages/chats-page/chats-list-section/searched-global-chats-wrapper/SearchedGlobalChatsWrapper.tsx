import { FC } from 'react';
import styles from './SearchedGlobalChatsWrapper.module.scss';
import { IFirebaseRtDbUser } from 'src/interfaces/firebaseRealtimeDatabase.interface';

interface SearchedChatsWrapperProps {
  searchedGlobalChats: 'error' | IFirebaseRtDbUser[];
}
const SearchedGlobalChatsWrapper: FC<SearchedChatsWrapperProps> = ({
  searchedGlobalChats,
}) => {
  console.log(searchedGlobalChats)
  return (
    <div className={styles['searched-global-chats-wrapper']}>
      <span className={styles['searched-global-chats-wrapper__text']}>Глобальный поиск</span>
    </div>
  );
};

export default SearchedGlobalChatsWrapper;
