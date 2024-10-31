import { FC } from 'react';
import styles from './MessageFileItem.module.scss';
import FileSvg from 'src/assets/images/icons/files-icons/filetype=generic.svg?react';
import DownloadSvg from 'src/assets/images/icons/24x24-icons/Download.svg?react';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';
import CircularLoadingProgressbar from 'src/components/ui/circular-loading-progressbar/CircularLoadingProgressbar';

interface MessageFileItemProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  isStatusesVisible?: boolean;
  isCheckedStatus: boolean;
  isLoadingStatus: boolean;
  timeStatus: string;
  isCanceledStatus?: boolean;
  isMessageOwn: boolean;
  progress: number | undefined;
  cancelUploads: () => void;
}

const MessageFileItem: FC<MessageFileItemProps> = ({
  fileUrl,
  fileName,
  fileSize,
  isStatusesVisible,
  timeStatus,
  isCheckedStatus,
  isLoadingStatus,
  isCanceledStatus,
  isMessageOwn,
  progress,
  cancelUploads,
}) => {
  return (
    <div className={styles['file-item']}>
      <div className={styles['file-item__left-wrapper']}>
        <div className={styles['file-item__file-icon-wrapper']}>
          {(progress === undefined ||
            progress === 100 ||
            isCanceledStatus === true) && (
            <FileSvg className={styles['file-item__file-icon']} />
          )}
          {progress !== undefined &&
            progress < 100 &&
            isCanceledStatus !== true && (
              <CircularLoadingProgressbar
                progress={progress}
                isFile={true}
                cancelUploads={cancelUploads}
              />
            )}
        </div>
        <div className={styles['file-item__info-wrapper']}>
          <span className={styles['file-item__name']}>{fileName}</span>
          <span className={styles['file-item__size']}>{`${fileSize} KB`}</span>
        </div>
      </div>
      <div className={styles['file-item__right-wrapper']}>
        {!isLoadingStatus && (
          <a
            href={fileUrl}
            aria-label="Download"
            download
            rel="noreferrer"
            className={styles['file-item__download-btn']}
          >
            <DownloadSvg className={styles['file-item__download-icon']} />
          </a>
        )}
        {isStatusesVisible && (
          <div
            className={
              isLoadingStatus
                ? styles['file-item__checked-and-time-statuses-wrapper']
                : ''
            }
          >
            <CheckedAndTimeStatuses
              isCanceled={isCanceledStatus}
              isLoading={isLoadingStatus}
              isChecked={isCheckedStatus}
              time={timeStatus}
              isOwn={isMessageOwn}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFileItem;
