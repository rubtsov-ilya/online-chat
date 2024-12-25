import { FC, useDeferredValue, useEffect, useRef, useState } from 'react';

import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react';
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react';

import styles from './SearchChatsByName.module.scss';
import {
  IFirebaseRtDbUser,
} from 'src/interfaces/firebaseRealtimeDatabase.interface';
import { fakeServerFunctionGetSearchedUsers } from 'src/services/fakeServerFunctionGetSearchedUsers';
import { IChatsWithImageAndName } from 'src/interfaces/chatsWithImageAndName.interface';
interface SearchChatsByNameProps {
  setSearchedGlobalChats: React.Dispatch<
  React.SetStateAction<IFirebaseRtDbUser[] | 'error'>
  >;
  setSearchedChats: React.Dispatch<React.SetStateAction<IChatsWithImageAndName[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
}

const SearchChatsByName: FC<SearchChatsByNameProps> = ({
  setSearchedGlobalChats,
  setSearchedChats,
  setIsSearching,
  isSearching,
}) => {
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const deferredSearchInputValue = useDeferredValue(searchInputValue);
  const searchRef = useRef<HTMLInputElement>(null);
  const onClearButtonClick = (): void => {
    setSearchInputValue('');
  };

  const onSearchInputClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  useEffect(() => {
    /* поиск и фильтрация - глобального поиска */
    if (deferredSearchInputValue.length > 0) {
      setIsSearching(true);
    }
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(async () => {
      if (deferredSearchInputValue.length > 0) {
        const searchedUsers = await fakeServerFunctionGetSearchedUsers(
          deferredSearchInputValue,
        );
        setSearchedGlobalChats(searchedUsers);
      }
    }, 1000);

    if (deferredSearchInputValue.length === 0 && isSearching !== false) {
      setIsSearching(false);
    }

    return () => {
      /* выполняется очистка таймаута на поиск при каждом вызове эффекта или размонтировании компонента*/
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [deferredSearchInputValue]);

  return (
    <div onClick={onSearchInputClick} className={styles['search']}>
      <SearchSvg className={styles['search__search-svg']} />
      <input
        ref={searchRef}
        value={searchInputValue}
        type="text"
        autoComplete="off"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchInputValue(e.target.value)
        }
        placeholder="Поиск"
        className={styles['search__input']}
      />
      {searchInputValue.length > 0 && (
        <DeleteCircleSvg
          onClick={onClearButtonClick}
          role="button"
          className={styles['search__delete-svg']}
        />
      )}
    </div>
  );
};

export default SearchChatsByName;
