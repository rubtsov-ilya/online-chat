import { FC, useEffect, useRef } from 'react';

import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react';
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react';

import styles from './SearchChatsByName.module.scss';
import {
  IFirebaseRtDbUser,
} from 'src/interfaces/firebaseRealtimeDatabase.interface';
import { fakeServerFunctionGetSearchedUsers } from 'src/services/fakeServerFunctionGetSearchedUsers';
interface SearchProps {
  setSearchInputValue: React.Dispatch<React.SetStateAction<string>>
  setSearchedGlobalChats: React.Dispatch<
  React.SetStateAction<IFirebaseRtDbUser[] | 'error'>
  >;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  searchInputValue: string
  deferredSearchInputValue: string
  isSearching: boolean;
}

const SearchChatsByName: FC<SearchProps> = ({
  setSearchInputValue,
  setSearchedGlobalChats,
  setIsSearching,
  searchInputValue,
  deferredSearchInputValue,
  isSearching,
}) => {
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
        console.log(searchedUsers);
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
