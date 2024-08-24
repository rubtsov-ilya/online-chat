import { FC } from 'react';
import styles from './MessageImage.module.scss';

interface MessageImageProps {
  width: '100%' | '50%' | '33.33%' | '66.66%';
  img: string;
}

const MessageImage: FC<MessageImageProps> = ({ width, img }) => {
  return (
    <div style={{ width }} className={styles['image-wrapper']}>
      <img src={img} alt="" className={styles['image']} />
    </div>
  );
};

export default MessageImage;
