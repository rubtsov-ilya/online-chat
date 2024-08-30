import { FC } from 'react';
import styles from './MessageImage.module.scss';

interface MessageImageProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  img: string;
  onImageClick: () => void;
}

const MessageImage: FC<MessageImageProps> = ({ width, img, onImageClick }) => {
  return (
    <div style={{ width }} className={styles['image-wrapper']}>
      <img
        onClick={onImageClick}
        src={img}
        alt=""
        className={styles['image']}
      />
    </div>
  );
};

export default MessageImage;
