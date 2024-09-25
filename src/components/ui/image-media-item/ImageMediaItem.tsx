import { FC } from 'react';
import styles from './ImageMediaItem.module.scss';

interface ImageMediaItemProps {
  imgUrl: string;
  setIsTopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileScreen: boolean;
}

const ImageMediaItem: FC<ImageMediaItemProps> = ({
  imgUrl,
  setIsTopBarVisible,
  isMobileScreen,
}) => {
  return (
    <img
      src={imgUrl}
      className={styles['image-item']}
      alt=""
      onClick={(e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        if (isMobileScreen) {
          setIsTopBarVisible((prev) => !prev);
        }
      }}
    />
  );
};

export default ImageMediaItem;
