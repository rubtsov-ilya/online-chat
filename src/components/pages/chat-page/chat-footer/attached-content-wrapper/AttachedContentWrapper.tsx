import { FC } from 'react';
import styles from './AttachedContentWrapper.module.scss';
import CrossSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import FileSvg from 'src/assets/images/icons/24x24-icons/File.svg?react';

const AttachedContentWrapper: FC = () => {
  return (
    <div className={styles['attached-content-wrapper']}>

      <div className={styles['attached-content-wrapper__item']}>
        <img
          className={styles['attached-content-wrapper__media']}
          src="https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=1380"
        />
        <button className={styles['attached-content-wrapper__cross-btn']}>
          <CrossSvg
            className={styles['attached-content-wrapper__cross-icon']}
          />
        </button>
      </div>

      <div className={styles['attached-content-wrapper__item']}>
        <video
          className={styles['attached-content-wrapper__media']}
          src="https://i.imgur.com/v5DeFBo.mp4"
        />
        <button className={styles['attached-content-wrapper__cross-btn']}>
          <CrossSvg
            className={styles['attached-content-wrapper__cross-icon']}
          />
        </button>
      </div>

      <div
        className={`${styles['attached-content-wrapper__item']} ${styles['attached-content-wrapper__item--file']}`}
      >
        <FileSvg className={styles['attached-content-wrapper__file-icon']} />
        <span className={styles['attached-content-wrapper__file-name']}>
          aasfasffsafaasf
        </span>
        <button className={styles['attached-content-wrapper__cross-btn']}>
          <CrossSvg
            className={`${styles['attached-content-wrapper__cross-icon']} ${styles['attached-content-wrapper__cross-icon--file']}`}
          />
        </button>
      </div>
    </div>
  );
};

export default AttachedContentWrapper;
