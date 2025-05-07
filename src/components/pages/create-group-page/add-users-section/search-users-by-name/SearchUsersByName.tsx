import { FC, useDeferredValue, useEffect, useRef, useState } from 'react';
import styles from './SearchUsersByName.module.scss';

import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react';
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react';
import useAuth from 'src/hooks/useAuth';
import {
  GroupedUsersType,
  IUserWithDetails,
} from 'src/interfaces/UserWithDetails.interface';

interface SearchUsersByNameProps {
  groupedUsers: GroupedUsersType;
  setSearchedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchUsersByName: FC<SearchUsersByNameProps> = ({
  groupedUsers,
  setSearchedUsers,
  setIsSearching,
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
    if (!deferredSearchInputValue) {
      setIsSearching(false);
      setSearchedUsers([]);
      return;
    } else {
      setIsSearching(true);
      const users = Object.values(groupedUsers).flatMap((user) => user);
      const filteredUsers = users.filter((user) =>
        user.username
          .toLowerCase()
          .includes(deferredSearchInputValue.toLowerCase()),
      );

      setSearchedUsers(filteredUsers);
    }
  }, [deferredSearchInputValue]);

  return (
    <div className={styles['search']}>
      <div onClick={onSearchInputClick} className={styles['search__content']}>
        <SearchSvg className={`${styles['search__search-svg']}`} />
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
    </div>
  );
};

export default SearchUsersByName;
