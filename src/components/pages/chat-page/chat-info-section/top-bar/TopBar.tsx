import { FC } from 'react';
import styles from './TopBar.module.scss';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';

interface TopBarProps {
  isMobileScreen: boolean | undefined;
  onCloseBtnClick: () => void;
}

const TopBar: FC<TopBarProps> = ({
  isMobileScreen,
  onCloseBtnClick,
}) => {
  return (
    <div className={styles['top-bar']}>
      <div
        className={`container ${isMobileScreen ? '' : 'container--max-width-unset'}`}
      >
        <div className={styles['top-bar__content']}>
          <button
            onClick={onCloseBtnClick}
            className={styles['top-bar__back-btn']}
          >
            <LeftChevronSvg
              className={styles['top-bar__back-icon']}
            />
          </button>
          <span className={styles['top-bar__text']}>Редактирование</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
