import { FC, useState } from 'react';
import styles from './MessageImage.module.scss';
import ModalGallery from 'src/components/ui/modal-gallery/ModalGallery';
import useBodyLock from 'src/hooks/useBodyLock';

interface MessageImageProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  img: string;
  messageData: any;
  index: number;
}

const MessageImage: FC<MessageImageProps> = ({
  width,
  img,
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
  const onImageClick = () => {
    toggleModal();
  };

  return (
    <div style={{ width }} className={styles['image-wrapper']}>
      <img
        onClick={onImageClick}
        src={img}
        alt=""
        className={styles['image']}
      />
      {messageData.media.length > 0 && isModalOpen && (
        <ModalGallery imageIndex={index} toggleModal={toggleModal} media={messageData.media} />
      )}
    </div>
  );
};

export default MessageImage;
