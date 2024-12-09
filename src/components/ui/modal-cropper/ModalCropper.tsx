import { Cropper } from 'react-cropper';
import styles from './ModalCropper.module.scss';
import './ModalCropper.scss';
import { FC, useLayoutEffect, useState } from 'react';
import 'cropperjs/dist/cropper.css';

interface ModalCropperProps {
  imageFile: File;
  isMobileScreen: boolean;
  closeModal?: () => void;
  uploadAvatar: (file: File) => Promise<void>;
  /* closeModal !== undefined, передаётся из ModalBackdrop через 
  React.cloneElement(children as... Поэтому указан проп как необязательный */
  /* const closeModal = () => {
    setIsVisible(false);
    toggleModal();
  }; */
}

const ModalCropper: FC<ModalCropperProps> = ({
  imageFile,
  isMobileScreen,
  closeModal,
  uploadAvatar,
}) => {
  const [cropperInstance, setCropperInstance] = useState<Cropper | null>(null);
  const [cropperSize, setCropperSize] = useState<{
    height: number;
    width: number;
  }>();

  useLayoutEffect(() => {
    /* расчёт ограничения обёртки. также имеется ограничение в max-width 100%. Тогда библиотека уже сама подстраивает значения. */
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = () => {
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - 64 - 32 - 60; // 64 - padding (32px сверху и снизу) в .modal-cropper, 32 - желаемый произвольный отступ между кнопками и изображением, 60 - высота &__buttons-wrapper

      const cropCoefficient = availableHeight / img.height;

      /* рассчёт ширины обёртки с учетом пропорций */
      const imageWidth = img.width * cropCoefficient;
      setCropperSize({ height: availableHeight, width: imageWidth });
    };
  }, [imageFile]);

  const onBtnClick = async () => {
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas();
      const croppedImageBase64 = croppedCanvas.toDataURL();

      const blob = await fetch(croppedImageBase64)
        .then((res) => res.blob())
        .catch((err) => {
          console.error('Error fetching blob:', err);
          return null;
        });

      if (blob) {
        // Создаем файл из полученного Blob
        const file = new File([blob], `${imageFile.name}`, { type: blob.type });

        // Передаем файл в функцию загрузки
        uploadAvatar(file);
        if (closeModal) {
          closeModal();
        }
      }
    }
  };

  return (
    <div
      className={styles['modal-cropper']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      onContextMenu={(e) => {
        if (isMobileScreen) {
          e.preventDefault();
        }
      }}
    >
      <div
        style={{
          height: `${cropperSize?.height}px`,
          width: `${cropperSize?.width}px`,
        }}
        className={styles['modal-cropper__cropper-wrapper']}
      >
        <Cropper
          className={styles['modal-cropper__cropper-component']}
          zoomTo={0}
          initialAspectRatio={1}
          src={URL.createObjectURL(imageFile)}
          viewMode={2}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          aspectRatio={1}
          /* preview=".img-preview" */
          background={false}
          responsive={true}
          autoCropArea={1}
          dragMode="move"
          movable={true}
          cropBoxResizable={true}
          /* cropBoxMovable={false} */
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
          onInitialized={(instance) => {
            setCropperInstance(instance);
          }}
        />
      </div>
      <div className={styles['modal-cropper__buttons-wrapper']}>
        <button
          onClick={onBtnClick}
          className={styles['modal-cropper__action-btn']}
        >
          Сохранить
        </button>
        <button
          onClick={closeModal!}
          className={styles['modal-cropper__cancel-btn']}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalCropper;
