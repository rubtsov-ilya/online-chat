import { FC } from 'react';
import styles from './NoResults.module.scss';
import EmptySvg from 'src/assets/images/icons/24x24-icons/Message.svg?react';

interface NoResultsProps {}

const NoResults: FC<NoResultsProps> = ({}) => {
  return (
    <div className={styles['no-results']}>
      <div className={styles['no-results__icon-wrapper']}>
        <EmptySvg
          width={136}
          height={136}
          viewBox="0 0 24 24"
          className={styles['no-results__svg']}
        />
        <span className={styles['no-results__text']}>{'Нет результатов'}</span>
      </div>
    </div>
  );
};

export default NoResults;
