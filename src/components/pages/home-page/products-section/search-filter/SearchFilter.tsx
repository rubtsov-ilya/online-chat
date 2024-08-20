import { FC, useEffect, useState } from 'react';

import SearchSvg from '../../../../../assets/images/home-page-icons/search.svg?react';
import CrossSvg from '../../../../../assets/images/home-page-icons/cross.svg?react';

import styles from './SearchFilter.module.sass';

interface SearchFilterProps {
  setSearchParameter: React.Dispatch<React.SetStateAction<string>>;
}

const SearchFilter: FC<SearchFilterProps> = ({ setSearchParameter }) => {
  const [inputSearchValue, setInputSearchValue] = useState('');
  const searchTitleParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const titleValue: string | null = searchTitleParams.get('title');
    if (titleValue) {
      if (titleValue.length > 0) {
        setSearchParameter(titleValue);
        setInputSearchValue(titleValue);
      }
    }
  }, []);

  useEffect(() => {
    searchTitleParams.set('title', inputSearchValue);
    if (inputSearchValue.length > 0) {
      const newUrl = `?${searchTitleParams.toString().toLowerCase()}`;
      window.history.pushState({}, '', newUrl);
    } else if (inputSearchValue.length === 0) {
      const newUrl = window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  }, [inputSearchValue]);

  const handleSearchButtonClick = (): void => {
    const titleValue: string | null = searchTitleParams.get('title');
    if (titleValue) {
      if (titleValue.length > 0) {
        setSearchParameter(titleValue);
      }
    } else {
      setSearchParameter('');
    }
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  const handleClearButtonClick = (): void => {
    setInputSearchValue('');
    setSearchParameter('');
  };

  return (
    <div className={styles['search']}>
      <input
        onKeyDown={handleSearchKeyDown}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputSearchValue(e.target.value)
        }
        value={inputSearchValue}
        className={styles['search__input']}
        placeholder="Procura por nome"
        type="text"
      />
      <div className={styles['search__controls']}>
        {inputSearchValue && (
          <>
            <button
              onClick={handleClearButtonClick}
              className={styles['search__clear-button']}
            >
              <CrossSvg className={styles['search__cross-icon']} />
            </button>
            <span className={styles['search__buttons-separator']}></span>
          </>
        )}
        <button
          onClick={handleSearchButtonClick}
          className={styles['search__search-button']}
        >
          <SearchSvg className={styles['search__search-icon']} />
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
