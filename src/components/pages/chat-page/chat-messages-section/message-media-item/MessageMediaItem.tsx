import { FC, useState } from 'react';
import styles from './MessageMediaItem.module.scss';
import ModalGallery from 'src/components/ui/modal-gallery/ModalGallery';
import useBodyLock from 'src/hooks/useBodyLock';
import PlaySvg from 'src/assets/images/icons/misc/Play.svg?react';
import { IMessage } from 'src/interfaces/Message.interface';

interface MessageMediaItemProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  imgUrl?: string;
  videoUrl?: string;
  messageData: IMessage;
  index: number;
}

const MessageMediaItem: FC<MessageMediaItemProps> = ({
  width,
  imgUrl,
  videoUrl,
  messageData,
  index,
}) => {
  const { toggleBodyLock } = useBodyLock();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = (timer?: number): void => {
    if (timer) {
      /* задержка для анимации при закрытии окна */
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
      {imgUrl && (
        <img
          loading="lazy"
          onClick={onItemClick}
          src={imgUrl}
          alt=""
          className={styles['media-item']}
        />
      )}
      {videoUrl && (
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
          <div className={styles['media-item__play-icon-wrapper']}>
            <PlaySvg className={styles['media-item__play-icon']} />
          </div>
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
