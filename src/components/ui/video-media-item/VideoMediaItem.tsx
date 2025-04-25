import { FC, useRef, useState } from 'react';
import styles from './VideoMediaItem.module.scss';

import PauseSvg from 'src/assets/images/icons/misc/Pause.svg?react';

interface VideoMediaItemProps {
  videoUrl: string;
  setIsTopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileScreen: boolean;
}

const VideoMediaItem: FC<VideoMediaItemProps> = ({
  setIsTopBarVisible,
  videoUrl,
  isMobileScreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPauseBtnVisible, setIsPauseBtnVisible] = useState<boolean>(false);

  const onVideoPlaying = () => {
    if (!isMobileScreen) {
      setIsPauseBtnVisible(true);
    } else {
      setIsTopBarVisible(false);
    }
  };

  const onVideoPausing = () => { 
    if (isMobileScreen) {
      setIsTopBarVisible(true);
    } 
   }

  return (
    <div
      className={styles['video-wrapper']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isMobileScreen) {
          setIsTopBarVisible((prev) => !prev);
        }
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className={`${styles['video-item']} ${isPauseBtnVisible ? styles['video-item--off-play-button'] : ''}`}
        controls
        onPlaying={onVideoPlaying}
        onPause={onVideoPausing}
        onEnded={() => setIsPauseBtnVisible(false)}
      />
      {isPauseBtnVisible && !isMobileScreen && (
        <button
          className={`${styles['video-item__pause-btn']} ${isMobileScreen ? styles['video-item__pause-btn--mobile'] : ''}`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (!videoRef.current?.paused) {
              videoRef.current?.pause();
              setIsPauseBtnVisible(false);
            }
          }}
        >
          <PauseSvg className={styles['video-item__pause-icon']} />
        </button>
      )}
    </div>
  );
};

export default VideoMediaItem;
