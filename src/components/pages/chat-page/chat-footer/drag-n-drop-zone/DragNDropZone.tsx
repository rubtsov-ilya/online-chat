import { FC, useState } from 'react';
import styles from './DragNDropZone.module.scss';

import imageCompression from 'browser-image-compression';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import { MAX_UPLOAD_FILE_SIZE } from 'src/constants'; // Импортируем константу
import { customToastError } from 'src/components/ui/custom-toast-container/CustomToastContainer';

interface DragNDropZoneProps {
  isDrag: boolean;
  setIsDrag: React.Dispatch<React.SetStateAction<boolean>>;
  updateAttachedItems: (state: AttachedItemType[]) => void
}

const DragNDropZone: FC<DragNDropZoneProps> = ({
  setIsDrag,
  isDrag,
  updateAttachedItems,
}) => {
  const [fileType, setFileType] = useState<'media' | 'file' | null>(null);
  const [isDragOnDropWrapper, setIsDragOnDropWrapper] = useState<
    'media' | 'file' | null
  >(null);

  const checkFileType = (e: React.DragEvent) => {
    const items = Array.from(e.dataTransfer.items);

    // Проверяем, все ли файлы являются изображениями или видео
    const isMedia = items.every(
      (item) =>
        item.kind === 'file' &&
        (item.type.startsWith('image') || item.type.startsWith('video')),
    );

    setFileType(isMedia ? 'media' : 'file');
  };

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

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    checkFileType(e);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    /* проверка происходит ли выход за пределы основного контейнера */
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (!currentTarget.contains(relatedTarget)) {
      setIsDrag(false);
    }
  };

  const onMediaDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
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
            return { imgUrl: url, name: file.name, fileObject: compressedFile };
          } else if (file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            return { videoUrl: url, name: file.name, fileObject: file };
          } else {
            /* const url = URL.createObjectURL(file); */
            return { isFile: true, name: file.name, fileObject: file };
          }
        }),
      );
      const validItems = newItems.filter(item => item !== null) as AttachedItemType[];
      if (validItems.length > 0) {
        updateAttachedItems(validItems);
      }
    }
    setIsDrag(false);
  };

  const onFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const newItems = Array.from(files).map((file) => {
        if (file.size > MAX_UPLOAD_FILE_SIZE) {
          customToastError("Максимальный размер 50MB");
          return null; // Если файл слишком большой, возвращаем null
        }
        /* const url = URL.createObjectURL(file); */
        return { isFile: true, name: file.name, fileObject: file };
      });
      const validItems = newItems.filter(item => item !== null) as AttachedItemType[];
      if (validItems.length > 0) {
        updateAttachedItems(validItems);
      }
    }
    setIsDrag(false);
  };

  return (
    <div
      className={`${styles['drag-n-drop-zone']} ${isDrag ? styles['drag-n-drop-zone--active'] : ''}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e: React.DragEvent) => {
        e.preventDefault();
        setIsDrag(false);
      }}
      onDragOver={(e: React.DragEvent) => e.preventDefault()}
    >
      {fileType !== null && (
        <div
          onDragOver={(e: React.DragEvent) => e.preventDefault()}
          onDrop={(e: React.DragEvent) => onFileDrop(e)}
          onDragEnter={() => setIsDragOnDropWrapper('file')}
          onDragLeave={(e: React.DragEvent) => {
            const currentTarget = e.currentTarget as HTMLElement;
            const relatedTarget = e.relatedTarget as HTMLElement | null;

            if (!currentTarget.contains(relatedTarget)) {
              setIsDragOnDropWrapper(null);
            }
          }}
          style={{ height: fileType === 'file' ? 'calc(70% + 8px)' : '35%' }}
          className={`${styles['drag-n-drop-zone__drop-wrapper']} ${isDragOnDropWrapper === 'file' ? styles['drag-n-drop-zone__drop-wrapper--active'] : ''}`}
        >
          <span className={styles['drag-n-drop-zone__top-span']}>
            Перетащите сюда файлы
          </span>
          <span className={styles['drag-n-drop-zone__bottom-span']}>
            для отправки без сжатия
          </span>
        </div>
      )}
      {fileType === 'media' && (
        <div
          onDrop={(e: React.DragEvent) => onMediaDrop(e)}
          onDragOver={(e: React.DragEvent) => e.preventDefault()}
          onDragEnter={() => setIsDragOnDropWrapper('media')}
          onDragLeave={(e: React.DragEvent) => {
            const currentTarget = e.currentTarget as HTMLElement;
            const relatedTarget = e.relatedTarget as HTMLElement | null;

            if (!currentTarget.contains(relatedTarget)) {
              setIsDragOnDropWrapper(null);
            }
          }}
          style={{ height: '35%' }}
          className={`${styles['drag-n-drop-zone__drop-wrapper']} ${isDragOnDropWrapper === 'media' ? styles['drag-n-drop-zone__drop-wrapper--active'] : ''}`}
        >
          <span className={styles['drag-n-drop-zone__top-span']}>
            Перетащите сюда файлы
          </span>
          <span className={styles['drag-n-drop-zone__bottom-span']}>
            для быстрой отправки
          </span>
        </div>
      )}
    </div>
  );
};

export default DragNDropZone;
