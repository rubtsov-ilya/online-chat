import { FC, useEffect, useRef, useState } from 'react';
import styles from './VideoMediaItem.module.scss';

import PauseSvg from 'src/assets/images/icons/misc/Pause.svg?react';

interface VideoMediaItemProps {
  videoUrl: string;
  setIsTopBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileScreen: boolean;
  isTopBarVisible: boolean;
}

const VideoMediaItem: FC<VideoMediaItemProps> = ({
  setIsTopBarVisible,
  videoUrl,
  isMobileScreen,
  isTopBarVisible,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPauseBtnVisible, setIsPauseBtnVisible] = useState<boolean>(false);

  const onVideoPlaying = () => {
    if (!isMobileScreen) {
      setIsPauseBtnVisible(true);
    } else if (isMobileScreen && isTopBarVisible) {
      setIsPauseBtnVisible(true);
    }
  };

  return (
    <div
      className={styles['video-wrapper']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isMobileScreen) {
          setIsTopBarVisible((prev) => !prev);
          if (!videoRef.current?.paused && isTopBarVisible) {
            setIsPauseBtnVisible(false);
          } else if (!videoRef.current?.paused && !isTopBarVisible) {
            setIsPauseBtnVisible(true);
          }
        }
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className={`${styles['video-item']} ${isPauseBtnVisible ? styles['video-item--off-play-button'] : ''}`}
        controls
        onPlaying={onVideoPlaying}
        onEnded={() => setIsPauseBtnVisible(false)}
      />
      {isPauseBtnVisible && (
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
