import { createPortal } from 'react-dom';
import { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

/* import CrossSvg from '../../../assets/images/home-page-icons/cross.svg?react'; */

import styles from './ModalGallery.module.scss';
import { useMediaQuery } from 'react-responsive';

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
        navigation={!isMobileScreen}
        initialSlide={imageIndex}
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
      </Swiper>
    </div>,
    document.getElementById('modal-gallery') as HTMLDivElement,
  );
};

export default ModalGallery;
