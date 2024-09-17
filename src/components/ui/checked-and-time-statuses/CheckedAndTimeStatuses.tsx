import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';

import styles from './CheckedAndTimeStatuses.module.scss';
import { FC } from 'react';

interface CheckedAndTimeStatusesProps {
  time: string;
  isChecked: boolean;
  isForImage?: boolean;
}

const CheckedAndTimeStatuses: FC<CheckedAndTimeStatusesProps> = ({
  time,
  isChecked,
  isForImage,
}) => {
  return (
    <div className={styles['checked-and-time-statuses']}>
      {isChecked && (
        <CheckedStatusSvg
          className={`${styles['checked-and-time-statuses__checked-mark']} ${isForImage ? styles['checked-and-time-statuses__checked-mark--image'] : ''}`}
        />
      )}
      {!isChecked && (
        <UncheckedStatusSvg
          className={`${styles['checked-and-time-statuses__unchecked-mark']} ${isForImage ? styles['checked-and-time-statuses__unchecked-mark--image'] : ''}`}
        />
      )}
      <span
        className={`${styles['checked-and-time-statuses__timestamp']} ${isForImage ? styles['checked-and-time-statuses__timestamp--image'] : ''}`}
      >
        {time}
      </span>
    </div>
  );
};

export default CheckedAndTimeStatuses;
