import { FC, useDeferredValue, useEffect, useRef, useState } from 'react';

import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react';
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react';

import styles from './SearchChatsByName.module.scss';
import { IFirebaseRtDbUser } from 'src/interfaces/firebaseRealtimeDatabase.interface';
import { fakeServerFunctionGetSearchedUsers } from 'src/services/fakeServerFunctionGetSearchedUsers';
import { IChatWithDetails } from 'src/interfaces/chatsWithDetails.interface';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import useAuth from 'src/hooks/useAuth';

interface SearchChatsByNameProps {
  setSearchedGlobalChats: React.Dispatch<
    React.SetStateAction<IFirebaseRtDbUser[] | 'error'>
  >;
  setSearchedChats: React.Dispatch<React.SetStateAction<IChatWithDetails[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
  chatsWithDetails: IChatWithDetails[];
}

const SearchChatsByName: FC<SearchChatsByNameProps> = ({
  setSearchedGlobalChats,
  setSearchedChats,
  setIsSearching,
  isSearching,
  chatsWithDetails,
}) => {
  const { uid } = useAuth();
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      setIsLoading(true);

      const searchedChats = chatsWithDetails.filter(
        (chat: IChatWithDetails) => {
          if (
            chat.membersDetails.length === 2 &&
            chat.groupChatname.length === 0
          ) {
            const otherMember = chat.membersDetails.find(
              (member) => member.uid !== uid,
            );
            return otherMember!.username
              ?.toLowerCase()
              .replace(/\s+/g, '')
              .includes(
                deferredSearchInputValue.toLowerCase().replace(/\s+/g, ''),
              );
          } else {
            return chat.groupChatname
              ?.toLowerCase()
              .replace(/\s+/g, '')
              .includes(
                deferredSearchInputValue.toLowerCase().replace(/\s+/g, ''),
              );
          }
        },
      );

      setSearchedChats(searchedChats);
    }
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(async () => {
      if (deferredSearchInputValue.length > 0) {
        try {
          const searchedGlobalUsers = await fakeServerFunctionGetSearchedUsers(
            deferredSearchInputValue,
          );
          setIsLoading(false);
          setSearchedGlobalChats(searchedGlobalUsers);
        } catch (error) {
          setIsLoading(false);
          setSearchedGlobalChats('error');
        }
      }
    }, 1000);

    if (deferredSearchInputValue.length === 0) {
      if (isSearching !== false) {
        setIsSearching(false);
      }
      if (isLoading !== false) {
        setIsLoading(false);
      }
      setSearchedChats([]);
      setSearchedGlobalChats([]);
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
      {!isLoading && (
        <SearchSvg
          className={`${styles['search__search-svg']} ${isLoading ? styles['search__search-svg--loading'] : ''}`}
        />
      )}
      {isLoading && (
        <div className={styles['search__circular-progressbar-wrapper']}>
          <CircularProgressbar
            className={styles['search__circular-progressbar']}
            value={66}
            styles={buildStyles({
              // can use 'butt' or 'round'
              strokeLinecap: 'round',
              // How long animation takes to go from one percentage to another, in seconds
              pathTransitionDuration: 0.5,
              // Colors
              pathColor: 'var(--base-accent-blue)',
              // textColor: '#f88',
              trailColor: 'none',
            })}
          />
        </div>
      )}
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
