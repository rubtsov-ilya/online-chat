import { FC, useState } from 'react';
import styles from './MessageMediaItem.module.scss';
import ModalGallery from 'src/components/ui/modal-gallery/ModalGallery';
import PlaySvg from 'src/assets/images/icons/misc/Play.svg?react';
import { IImgMedia, IMessage, IVideoMedia } from 'src/interfaces/Message.interface';
import CircularLoadingProgressbar from 'src/components/ui/circular-loading-progressbar/CircularLoadingProgressbar';
import { ILoadingVideoMedia } from 'src/interfaces/LoadingMessage.interface';
import useBodyLockContext from 'src/hooks/useBodyLockContext';

interface MessageMediaItemProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  imgUrl?: IImgMedia['imgUrl'];
  videoUrl?: IVideoMedia['videoUrl'];
  videoPreview?: IVideoMedia['videoPreview'];
  messageData: IMessage;
  index: number;
  progress: ILoadingVideoMedia['progress'] | undefined;
  progressPreview: ILoadingVideoMedia['progressPreview'] | undefined;
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
  const { toggleBodyLock } = useBodyLockContext();
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
            onDragStart={(e: React.DragEvent<HTMLImageElement>) =>
              e.preventDefault()
            }
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
            onDragStart={(e: React.DragEvent<HTMLVideoElement>) =>
              e.preventDefault()
            }
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
