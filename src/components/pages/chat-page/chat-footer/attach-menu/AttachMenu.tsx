import { FC, useEffect, useRef, useState } from 'react';
import styles from './AttachMenu.module.scss';

import MediaSvg from 'src/assets/images/icons/24x24-icons/Media.svg?react';
import FileSvg from 'src/assets/images/icons/24x24-icons/File.svg?react';

import AttachSvg from 'src/assets/images/icons/24x24-icons/Attach.svg?react';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

import imageCompression from 'browser-image-compression';
import { MAX_UPLOAD_FILE_SIZE } from 'src/constants';
import CustomToastContainer, { customToastError } from 'src/components/ui/custom-toast-container/CustomToastContainer';

interface AttachBtnProps {
  isMobileScreen: boolean;
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
  isAttachedItems: boolean;
}

const AttachMenu: FC<AttachBtnProps> = ({
  isMobileScreen,
  setAttachedItems,
  isAttachedItems,
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

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 10, // Максимальный размер файла в мегабайтах
      useWebWorker: true, // Использование Web Worker для сжатия
      initialQuality: 0.97, // Начальное качество сжатия (97%)
      alwaysKeepResolution: true, // Сохранять ширину и высоту изначальную
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Ошибка сжатия изображения:', error);
      return file;
    }
  };

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
        <div
          className={`${styles['attach-menu__menu-wrapper']} ${isAttachedItems ? styles['attach-menu__menu-wrapper--bottom'] : ''}`}
        >
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
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files) {
              const newItems = await Promise.all(
                Array.from(files).map(async (file) => {
                  if (file.size > MAX_UPLOAD_FILE_SIZE) {
                    customToastError("Максимальный размер 50MB");
                    return null; // Если файл слишком большой, возвращаем null
                  }
                  if (file.type.startsWith('image/')) {
                    const compressedFile = await compressImage(file);
                    const url = URL.createObjectURL(compressedFile);
                    return {
                      imgUrl: url,
                      name: file.name,
                      fileObject: compressedFile,
                    };
                  } else if (file.type.startsWith('video/')) {
                    const url = URL.createObjectURL(file);
                    return { videoUrl: url, name: file.name, fileObject: file };
                  } else {
                    return { isFile: true, name: file.name, fileObject: file };
                  }
                }),
              );
              const validItems = newItems.filter(item => item !== null) as AttachedItemType[];
              if (validItems.length > 0) {
                setAttachedItems((prevItems) => [...prevItems, ...validItems]);
              }
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
                /* const url = URL.createObjectURL(file); */
                if (file.size > MAX_UPLOAD_FILE_SIZE) {
                  customToastError("Максимальный размер 50MB");
                  return null; // Если файл слишком большой, возвращаем null
                }
                return { isFile: true, name: file.name, fileObject: file };
              });
              const validItems = newItems.filter(item => item !== null) as AttachedItemType[];
              if (validItems.length > 0) {
                setAttachedItems((prevItems) => [...prevItems, ...validItems]);
              }
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
