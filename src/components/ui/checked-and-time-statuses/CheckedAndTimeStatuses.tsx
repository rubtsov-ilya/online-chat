import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';
import ErrorSvg from 'src/assets/images/icons/24x24-icons/Error.svg?react';
import LoadingSvg from 'src/assets/images/icons/24x24-icons/Clock loading.svg?react';

import styles from './CheckedAndTimeStatuses.module.scss';
import { FC } from 'react';
import { IMessage } from 'src/interfaces/Message.interface';

interface CheckedAndTimeStatusesProps {
  time: IMessage['messageDateUTC'];
  isChecked: boolean;
  isForImage?: boolean;
  isOwn: boolean;
  isCanceled: boolean | undefined;
  isLoading: boolean;
}

const CheckedAndTimeStatuses: FC<CheckedAndTimeStatusesProps> = ({
  time,
  isChecked,
  isForImage,
  isOwn,
  isCanceled,
  isLoading,
}) => {
  const timeDate = new Date(time as number);
  const formattedTime = `${timeDate.getHours().toString().padStart(2, '0')}:${timeDate.getMinutes().toString().padStart(2, '0')}`;
  return (
    <div className={styles['checked-and-time-statuses']} onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
    }}>
      {!isCanceled && isLoading !== true && isChecked && isOwn && (
        <CheckedStatusSvg
          className={`${styles['checked-and-time-statuses__checked-icon']} ${isForImage ? styles['checked-and-time-statuses__checked-mark--image'] : ''}`}
        />
      )}
      {!isCanceled && isLoading !== true && !isChecked && isOwn && (
        <UncheckedStatusSvg
          className={`${styles['checked-and-time-statuses__unchecked-icon']} ${isForImage ? styles['checked-and-time-statuses__unchecked-mark--image'] : ''}`}
        />
      )}
      {isCanceled && (
        <ErrorSvg className={styles['checked-and-time-statuses__error-icon']} />
      )}

      {!isCanceled && isLoading === true && (
        <LoadingSvg
          className={`${styles['checked-and-time-statuses__loading-icon']} ${isForImage ? styles['checked-and-time-statuses__loading-icon--image'] : ''}`}
        />
      )}

      <span
        className={`${styles['checked-and-time-statuses__timestamp']} ${isForImage ? styles['checked-and-time-statuses__timestamp--image'] : ''}`}
      >
        {formattedTime}
      </span>
    </div>
  );
};

export default CheckedAndTimeStatuses;
