import { FC, useState } from 'react';
import styles from './MessageImage.module.scss';
import useBodyLock from 'src/hooks/useBodyLock';
import ModalGallery from 'src/components/ui/modal-gallery/ModalGallery';

interface MessageImageProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  img: string;
}

const MessageImage: FC<MessageImageProps> = ({ width, img }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { toggleBodyLock } = useBodyLock();
  const onImageClick = (): void => {
    setIsModalOpen((prev) => !prev);
    toggleBodyLock();
  };

  return (
    <div style={{ width }} className={styles['image-wrapper']}>
      <img onClick={onImageClick} src={img} alt="" className={styles['image']} />
      <ModalGallery isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default MessageImage;
