import { createPortal } from 'react-dom';
import { FC, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import NextSvg from 'src/assets/images/icons/24x24-icons/Right Chevron.svg?react';
import PrevSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import DownloadSvg from 'src/assets/images/icons/24x24-icons/Download.svg?react';
import 'swiper/css';
import 'swiper/css/navigation';

/* import CrossSvg from '../../../assets/images/home-page-icons/cross.svg?react'; */

import styles from './ModalGallery.module.scss';
import { useMediaQuery } from 'react-responsive';
import type { Swiper as SwiperType } from 'swiper';

interface ModalGalleryProps {
  toggleModal: (timer?: number) => void;
  media: {
    imgUrl?: string;
    videoUrl?: string;
  }[];
  mediaIndex: number;
}

const ModalGallery: FC<ModalGalleryProps> = ({
  toggleModal,
  media,
  mediaIndex,
}) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)' });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState<boolean>(true);
  const [navigationState, setNavigationState] = useState<
    'isBeginning' | null | 'isEnd' | 'isOne'
  >(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    toggleModal(100);
    /* аргумент - длительность transition opacity в modal-gallery */
  };

  const onSwiperAction = (swiper: SwiperType) => {
    if (
      media[swiper.activeIndex].imgUrl &&
      downloadLink !== media[swiper.activeIndex].imgUrl
    ) {
      setDownloadLink(media[swiper.activeIndex].imgUrl!);
    }
    if (
      media[swiper.activeIndex].videoUrl &&
      downloadLink !== media[swiper.activeIndex].videoUrl
    ) {
      setDownloadLink(media[swiper.activeIndex].videoUrl!);
    }

    if (!isMobileScreen) {
      if (swiper.isBeginning && swiper.isEnd) {
        setNavigationState('isOne');
      } else if (swiper.isBeginning) {
        setNavigationState('isBeginning');
      } else if (swiper.isEnd) {
        setNavigationState('isEnd');
      } else {
        if (navigationState !== null) {
          setNavigationState(null);
        }
      }
    }
  };

  return createPortal(
    <div
      className={`${styles['modal-gallery']} ${isVisible ? styles['modal-gallery--visible'] : ''}`}
      onClick={closeModal}
    >
      <div
        className={`${styles['modal-gallery__top-bar']} ${isMobileScreen ? styles['modal-gallery__top-bar--mobile'] : ''} ${isMobileScreen && isTopBarVisible ? styles['active'] : ''}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {downloadLink && (
          <a
            href={downloadLink}
            aria-label="Download"
            download
            rel="noreferrer"
            className={styles['modal-gallery__tob-bar-btn']}
          >
            <DownloadSvg className={styles['modal-gallery__tob-bar-icon']} />
          </a>
        )}
        <button
          className={styles['modal-gallery__tob-bar-btn']}
          onClick={closeModal}
        >
          <CloseSvg className={styles['modal-gallery__tob-bar-icon']} />
        </button>
      </div>

      <Swiper
        className={styles['modal-gallery__swiper']}
        slidesPerView={1}
        modules={[Navigation]}
        navigation={
          !isMobileScreen
            ? {
                nextEl: nextRef.current,
                prevEl: prevRef.current,
              }
            : undefined
        }
        initialSlide={mediaIndex}
        onInit={onSwiperAction}
        onSlideChange={onSwiperAction}
      >
        {media.map((mediaItem, index) => (
          <SwiperSlide key={index} className={styles['modal-gallery__slide']}>
            {mediaItem.imgUrl && (
              <img
                src={mediaItem.imgUrl}
                className={styles['modal-gallery__media-item']}
                alt=""
                onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                  e.stopPropagation();
                  if (isMobileScreen) {
                    setIsTopBarVisible((prev) => !prev);
                  }
                }}
              />
            )}
            {mediaItem.videoUrl && (
              <div
                className={styles['modal-gallery__video-wrapper']}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  if (isMobileScreen) {
                    setIsTopBarVisible((prev) => !prev);
                  }
                }}
              >
                <video
                  src={mediaItem.videoUrl}
                  className={`${styles['modal-gallery__media-item']} ${styles['modal-gallery__media-item--video']}`}
                  controls
                />
              </div>
            )}
          </SwiperSlide>
        ))}
        {!isMobileScreen && navigationState !== 'isOne' && (
          <button
            ref={prevRef}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}
            className={`${styles['modal-gallery__prev-btn']} ${navigationState === 'isBeginning' ? 'none' : ''}`}
          >
            <PrevSvg className={styles['modal-gallery__navigation-svg']} />
          </button>
        )}
        {!isMobileScreen && navigationState !== 'isOne' && (
          <button
            ref={nextRef}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}
            className={`${styles['modal-gallery__next-btn']} ${navigationState === 'isEnd' ? 'none' : ''}`}
          >
            <NextSvg className={styles['modal-gallery__navigation-svg']} />
          </button>
        )}
      </Swiper>
    </div>,
    document.getElementById('modal-gallery') as HTMLDivElement,
  );
};

export default ModalGallery;
