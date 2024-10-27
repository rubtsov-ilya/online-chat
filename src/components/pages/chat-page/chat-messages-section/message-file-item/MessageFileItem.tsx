import { FC } from 'react';
import styles from './MessageFileItem.module.scss';
import FileSvg from 'src/assets/images/icons/files-icons/filetype=generic.svg?react';
import DownloadSvg from 'src/assets/images/icons/24x24-icons/Download.svg?react';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';

interface MessageFileItemProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isStatusesVisible?: boolean;
  isCheckedStatus?: boolean;
  timeStatus?: string;
  isMessageOwn: boolean;
}

const MessageFileItem: FC<MessageFileItemProps> = ({
  fileUrl,
  fileName,
  fileSize,
  isStatusesVisible,
  timeStatus,
  isCheckedStatus,
  isMessageOwn,
}) => {
  return (
    <div className={styles['file-item']}>
      <div className={styles['file-item__left-wrapper']}>
        <FileSvg className={styles['file-item__file-icon']} />
        <div className={styles['file-item__info-wrapper']}>
          <span className={styles['file-item__name']}>{fileName}</span>
          <span className={styles['file-item__size']}>{`${fileSize} KB`}</span>
        </div>
      </div>
      <div className={styles['file-item__right-wrapper']}>
        <a
          href={fileUrl}
          aria-label="Download"
          download
          rel="noreferrer"
          className={styles['file-item__download-btn']}
        >
          <DownloadSvg className={styles['file-item__download-icon']} />
        </a>
        {isStatusesVisible && isCheckedStatus && timeStatus && (
          <CheckedAndTimeStatuses
            isChecked={isCheckedStatus}
            time={timeStatus}
            isOwn={isMessageOwn}
          />
        )}
      </div>
    </div>
  );
};

export default MessageFileItem;
