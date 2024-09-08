import { createPortal } from 'react-dom';
import { FC, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import NextSvg from 'src/assets/images/icons/24x24-icons/Right Chevron.svg?react';
import PrevSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import 'swiper/css';
import 'swiper/css/navigation';

/* import CrossSvg from '../../../assets/images/home-page-icons/cross.svg?react'; */

import styles from './ModalGallery.module.scss';
import { useMediaQuery } from 'react-responsive';
import type { Swiper as SwiperType } from 'swiper';

interface ModalGalleryProps {
  toggleModal: (timer?: number) => void;
  media: {
    img: string;
  }[];
  imageIndex: number;
}

const ModalGallery: FC<ModalGalleryProps> = ({
  toggleModal,
  media,
  imageIndex,
}) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)' });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState<boolean>(true);
  const [navigationState, setNavigationState] = useState<
    'isBeginning' | null | 'isEnd' | 'isOne'
  >(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  console.log(navigationState);
  console.log('next', nextRef.current);
  console.log('prev', prevRef.current);

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

  const toggleNavitation = (swiper: SwiperType) => {
    if (swiper.isBeginning && swiper.isEnd) {
      setNavigationState('isOne');
    } else if (swiper.isBeginning) {
      setNavigationState('isBeginning');
    } else if (swiper.isEnd) {
      setNavigationState('isEnd');
    } else {
      setNavigationState(null);
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
        <button
          className={styles['modal-gallery__close-btn']}
          onClick={closeModal}
        >
          {/* <CrossSvg className={styles['modal-gallery__close-icon']} /> */}X
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
        initialSlide={imageIndex}
        onInit={toggleNavitation}
        onSlideChange={toggleNavitation}
      >
        {media.map((mediaItem, index) => (
          <SwiperSlide key={index} className={styles['modal-gallery__slide']}>
            <img
              src={mediaItem.img}
              className={styles['modal-gallery__media-item']}
              alt=""
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                if (isMobileScreen) {
                  setIsTopBarVisible((prev) => !prev);
                }
              }}
            />
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
