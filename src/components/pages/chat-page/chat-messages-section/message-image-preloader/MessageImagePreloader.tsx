import { FC } from 'react';
import styles from './MessageImagePreloader.module.scss';

interface MessageImagePreloaderProps {
  width: string;
}

const MessageImagePreloader: FC<MessageImagePreloaderProps> = ({ width }) => {
  return (
    <div style={{ width }} className={styles['image-preloader']}>
      <div className={styles['image-preloader__bg']}></div>
    </div>
  );
};

export default MessageImagePreloader;
