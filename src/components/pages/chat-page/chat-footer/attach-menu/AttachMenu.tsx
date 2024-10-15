import { FC, useEffect, useRef, useState } from 'react';
import styles from './AttachMenu.module.scss';

import MediaSvg from 'src/assets/images/icons/24x24-icons/Media.svg?react';
import FileSvg from 'src/assets/images/icons/24x24-icons/File.svg?react';

import AttachSvg from 'src/assets/images/icons/24x24-icons/Attach.svg?react';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

interface AttachBtnProps {
  isMobileScreen: boolean;
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
}

const AttachMenu: FC<AttachBtnProps> = ({
  isMobileScreen,
  setAttachedItems,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isOverlayHovered, setIsOverlayHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<null | NodeJS.Timeout>(null);

  const acceptFormats =
    'image/jpeg, image/png, image/bmp, image/webp, image/avif, image/gif, video/mp4, video/webm';

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout!);
    };
  }, []);

  useEffect(() => {
    if (!isMobileScreen) {
      if (isOverlayHovered) {
        setIsMenuOpen(false);
      }
    }
  }, [isOverlayHovered]);

  return (
    <>
      <div className={styles['attach-menu']}>
        <button
          className={styles['attach-btn']}
          onClick={() => {
            if (isMobileScreen) {
              setIsMenuOpen((prev) => !prev);
            }
          }}
          onMouseEnter={() => {
            if (!isMobileScreen) {
              setIsMenuOpen(true);
              clearTimeout(hoverTimeout!);
              setIsOverlayHovered(false);
            }
          }}
        >
          <AttachSvg
            className={`${styles['attach-btn__icon']} ${isMenuOpen ? styles['active'] : ''}`}
          />
        </button>
        <div className={`${styles['attach-menu__menu-wrapper']}`}>
          <div
            className={`${styles['attach-menu__menu']} ${isMenuOpen ? styles['active'] : ''}`}
          >
            <button
              className={styles['attach-menu__btn']}
              onClick={() => {
                setIsMenuOpen(false);
                mediaInputRef.current?.click();
              }}
            >
              <MediaSvg className={styles['attach-menu__btn-icon']} />
              <span className={styles['attach-menu__btn-text']}>
                Фото или видео
              </span>
            </button>
            <button
              className={styles['attach-menu__btn']}
              onClick={() => {
                setIsMenuOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <FileSvg className={styles['attach-menu__btn-icon']} />
              <span className={styles['attach-menu__btn-text']}>Файл</span>
            </button>
          </div>
        </div>
        <input
          ref={mediaInputRef}
          type="file"
          accept={acceptFormats}
          multiple
          style={{ display: 'none' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files) {
              const newItems = Array.from(files).map((file) => {
                const fileType = file.type;
                const url = URL.createObjectURL(file);
                if (fileType.startsWith('image/')) {
                  return { imgUrl: url };
                } else if (fileType.startsWith('video/')) {
                  return { videoUrl: url };
                } else {
                  return { fileUrl: url, fileName: file.name };
                }
              });
              setAttachedItems((prevItems) => [...prevItems, ...newItems]);
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files) {
              const newItems = Array.from(files).map((file) => {
                const url = URL.createObjectURL(file);
                return { fileUrl: url, fileName: file.name };
              });
              setAttachedItems((prevItems) => [...prevItems, ...newItems]);
            }
          }}
        />
      </div>
      {isMenuOpen && (
        <div
          className={styles['attach-overlay']}
          onClick={() => setIsMenuOpen(false)}
          onMouseEnter={() => {
            if (!isMobileScreen) {
              const timeout = setTimeout(() => {
                setIsOverlayHovered(true);
              }, 800);
              setHoverTimeout(timeout);
            }
          }}
          onMouseLeave={() => {
            if (!isMobileScreen) {
              clearTimeout(hoverTimeout!);
              if (isOverlayHovered === true) {
                setIsOverlayHovered(false);
              }
            }
          }}
        ></div>
      )}
    </>
  );
};

export default AttachMenu;
