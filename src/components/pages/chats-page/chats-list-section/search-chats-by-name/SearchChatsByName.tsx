import { FC, useDeferredValue, useEffect, useRef, useState } from 'react';

import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react';
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react';

import styles from './SearchChatsByName.module.scss';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import {
  IChatWithDetails,
  IMemberDetails,
} from 'src/interfaces/ChatsWithDetails.interface';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import useAuth from 'src/hooks/useAuth';
import { CIRCULAR_LOADING_PERCENT_VALUE } from 'src/constants';
import { getSearchedUsersService } from 'src/services/getSearchedUsers';
import useNormalizedUsername from 'src/hooks/useNormalizedUsername';

interface SearchChatsByNameProps {
  setSearchedGlobalChats: React.Dispatch<
    React.SetStateAction<IFirebaseRtDbUser[]>
  >;
  setSearchedChats: React.Dispatch<React.SetStateAction<IChatWithDetails[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
  isLoading: boolean;
  chatsWithDetails: IChatWithDetails[];
}

const SearchChatsByName: FC<SearchChatsByNameProps> = ({
  setSearchedGlobalChats,
  setSearchedChats,
  setIsSearching,
  setIsLoading,
  isSearching,
  isLoading,
  chatsWithDetails,
}) => {
  const { uid } = useAuth();
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
    // поиск и фильтрация
    if (deferredSearchInputValue.length > 0) {
      setIsSearching(true);
      setIsLoading(true);
      setSearchedGlobalChats([]);
      // локальный поиск
      const filteredChats = chatsWithDetails.filter(
        (chat: IChatWithDetails) => {
          if (chat.isGroup === false) {
            const otherMember = chat.membersDetails.find(
              (member) => member.uid !== uid,
            ) as IMemberDetails;
            const otherMemberUsername = useNormalizedUsername(
              otherMember.username,
            );
            return otherMemberUsername.includes(
              useNormalizedUsername(deferredSearchInputValue),
            );
          } else {
            const groupChatname = useNormalizedUsername(chat.groupChatname);
            return groupChatname.includes(
              useNormalizedUsername(deferredSearchInputValue),
            );
          }
        },
      );
      setSearchedChats(filteredChats);
    }

    // глобальный поиск
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(async () => {
      if (deferredSearchInputValue.length > 0) {
        try {
          const searchedGlobalUsers = await getSearchedUsersService(
            useNormalizedUsername(deferredSearchInputValue),
          );

          const existingChatIds = Array.from(
            new Set(
              chatsWithDetails
                .filter((chat) => chat.isGroup === false) // фильтровать не групповые
                .flatMap((chat) =>
                  chat.membersDetails.map((member) => member.uid),
                ),
            ),
          );

          const filteredGlobalUsers = searchedGlobalUsers !== undefined ? searchedGlobalUsers.filter(
            (user: IFirebaseRtDbUser) =>
              user.uid !== uid && // исключить себя
              !existingChatIds.includes(user.uid), // исключить уже существующие чаты
          ) : [];

          setIsLoading(false);
          setSearchedGlobalChats(filteredGlobalUsers);
        } catch (error) {
          setIsLoading(false);
          setSearchedGlobalChats([]);
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
            value={CIRCULAR_LOADING_PERCENT_VALUE}
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
