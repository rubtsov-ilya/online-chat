import { FC } from 'react';
import styles from './MessageFileItem.module.scss';
import FileSvg from 'src/assets/images/icons/files-icons/filetype=generic.svg?react';
import DownloadSvg from 'src/assets/images/icons/24x24-icons/Download.svg?react';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';

interface MessageFileItemProps {
  fileUrl: string;
  fileName: string;
  isStatusesVisible?: boolean;
  isCheckedStatus?: boolean;
  timeStatus?: string;
}

const MessageFileItem: FC<MessageFileItemProps> = ({
  fileUrl,
  fileName,
  isStatusesVisible,
  timeStatus,
  isCheckedStatus,
}) => {
  return (
    <div className={styles['file-item']}>
      <div className={styles['file-item__left-wrapper']}>
        <FileSvg className={styles['file-item__file-icon']} />
        <div className={styles['file-item__info-wrapper']}>
          <span className={styles['file-item__name']}>
            {fileName.length > 25 ? fileName.slice(0, 25) + '...' : fileName}
          </span>
          <span className={styles['file-item__size']}>{`${'123'} KB`}</span>
        </div>
      </div>
      <div className={styles['file-item__right-wrapper']}>
        <button className={styles['file-item__download-btn']}>
          <DownloadSvg className={styles['file-item__download-icon']} />
        </button>
        {isStatusesVisible && isCheckedStatus && timeStatus && (
          <CheckedAndTimeStatuses
            isChecked={isCheckedStatus}
            time={timeStatus}
          />
        )}
      </div>
    </div>
  );
};

export default MessageFileItem;
