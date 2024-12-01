import { Cropper } from 'react-cropper';
import styles from './ModalCropper.module.scss';
import './ModalCropper.scss';
import { FC } from 'react';
import 'cropperjs/dist/cropper.css';

interface ModalCropperProps {
  image: string;
  isMobileScreen: boolean;
  closeModal?: () => void;
  /* closeModal !== undefined, передаётся из ModalBackdrop через 
  React.cloneElement(children as... Поэтому указан проп как необязательный */
  /* const closeModal = () => {
    setIsVisible(false);
    toggleModal();
  }; */
}

const ModalCropper: FC<ModalCropperProps> = ({
  image,
  isMobileScreen,
  closeModal,
}) => {
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
      <Cropper
        className={styles['modal-cropper__cropper-component']}
        zoomTo={0}
        initialAspectRatio={1}
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        aspectRatio={1}
        /* preview=".img-preview" */
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        onInitialized={(instance) => {
          /* setCropper(instance); */
        }}
        guides={true}
      />
    </div>
  );
};

export default ModalCropper;
