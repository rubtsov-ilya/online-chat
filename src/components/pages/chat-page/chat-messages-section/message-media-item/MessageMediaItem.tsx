import { FC, useState } from 'react';
import styles from './MessageMediaItem.module.scss';
import ModalGallery from 'src/components/ui/modal-gallery/ModalGallery';
import useBodyLock from 'src/hooks/useBodyLock';
import PlaySvg from 'src/assets/images/icons/misc/Play.svg?react';
import { IMessage } from 'src/interfaces/Message.interface';
import CircularLoadingProgressbar from 'src/components/ui/circular-loading-progressbar/CircularLoadingProgressbar';

interface MessageMediaItemProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  imgUrl?: string;
  videoUrl?: string;
  videoPreview?: string;
  messageData: IMessage;
  index: number;
  progress: number | undefined;
  progressPreview: number | undefined;
  cancelUploads: () => void;
}

const MessageMediaItem: FC<MessageMediaItemProps> = ({
  width,
  imgUrl,
  videoUrl,
  videoPreview,
  messageData,
  progress,
  progressPreview,
  index,
  cancelUploads,
}) => {
  const { toggleBodyLock } = useBodyLock();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = (timer?: number): void => {
    if (timer) {
      /* задержка для отработки анимации при закрытии окна */
      toggleBodyLock();
      setTimeout(() => {
        setIsModalOpen((prev) => !prev);
      }, timer);
    } else {
      setIsModalOpen((prev) => !prev);
      toggleBodyLock();
    }
  };
  const onItemClick = () => {
    toggleModal();
  };

  return (
    <div style={{ width }} className={styles['media-item-wrapper']}>
      {(imgUrl || (videoPreview && videoPreview.length > 0)) && (
        <>
          <img
            loading="lazy"
            onClick={onItemClick}
            src={imgUrl || videoPreview}
            alt=""
            className={styles['media-item']}
          />
          {progress !== undefined && progress < 100 && (
            <CircularLoadingProgressbar
              progress={progress}
              cancelUploads={cancelUploads}
            />
          )}
        </>
      )}
      {videoUrl && videoPreview?.length === 0 && (
        <>
          <video
            preload="metadata"
            onClick={onItemClick}
            className={styles['media-item']}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
          </video>
          {(progress === undefined ||
            (progress === 100 && progressPreview === 100)) && (
            <div className={styles['media-item__play-icon-wrapper']}>
              <PlaySvg className={styles['media-item__play-icon']} />
            </div>
          )}
          {progress !== undefined &&
            progressPreview !== undefined &&
            (progress < 100 || progressPreview < 100) && (
              <CircularLoadingProgressbar
                progress={progress}
                cancelUploads={cancelUploads}
              />
            )}
        </>
      )}
      {messageData.media.length > 0 && isModalOpen && (
        <ModalGallery
          mediaIndex={index}
          toggleModal={toggleModal}
          media={messageData.media}
        />
      )}
    </div>
  );
};

export default MessageMediaItem;
