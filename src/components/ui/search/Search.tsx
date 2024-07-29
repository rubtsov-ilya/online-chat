import { FC, useRef, useState } from "react";
import styles from "./Search.module.scss";
import DeleteCircleSvg from 'src/assets/images/icons/24x24-icons/Delete cirlce.svg?react'
import SearchSvg from 'src/assets/images/icons/24x24-icons/Search.svg?react'

const Search: FC = () => {
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const onSearchInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      /* main callback */
      console.log(`first`);
    }
  };

  const onClearButtonClick = (): void => {
    setSearchInputValue("");
  };

  const onSearchInputClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  return (
    <div onClick={onSearchInputClick} className={styles["search"]}>
      <SearchSvg className={styles["search__search-svg"]}/>
      <input
        ref={searchRef}
        value={searchInputValue}
        type="text"
        autoComplete="off"
        onKeyDown={onSearchInputKeyDown}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchInputValue(e.target.value)
        }
        placeholder="Поиск"
        className={styles["search__input"]}
      />
      {searchInputValue.length > 0 && <DeleteCircleSvg onClick={onClearButtonClick} role="button" className={styles["search__delete-svg"]} />}
    </div>
  );
};

export default Search;
