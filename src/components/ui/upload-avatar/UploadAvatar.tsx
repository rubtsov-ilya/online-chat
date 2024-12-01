import { FC, useRef, useState } from 'react';
import styles from './UploadAvatar.module.scss';
import AvatarImage from '../avatar-image/AvatarImage';
import useToggleModal from 'src/hooks/useToggleModal';
import imageCompression from 'browser-image-compression';
import ModalBackdrop from '../modal-backdrop/ModalBackdrop';
import CameraSvg from 'src/assets/images/icons/24x24-icons/Camera.svg?react';
import ModalCropper from '../modal-cropper/ModalCropper';
import useMobileScreen from 'src/hooks/useMobileScreen';

interface UploadAvatarProps {
  userAvatarImg: string;
}

interface IAvatar {
  imgUrl: string;
  name: string;
  fileObject: File;
}

const UploadAvatar: FC<UploadAvatarProps> = ({ userAvatarImg }) => {
  const { isMobileScreen } = useMobileScreen();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<IAvatar | null>(null);
  const [uploadProgress, setUploadProgress] = useState<
    number | 'error' | false
  >(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const openModal = () => toggleModal(true);

  /* const closeModal = () => toggleModal(false, 100); */

  /* {modalOpen && (
  //аргумент number в toggleModal - длительность transition opacity в modal-backdrop 
  <ModalBackdrop
    toggleModal={() => toggleModal(false, 100)}
    divIdFromIndexHtml={'modal-backdrop'}
  >
    <ModalActionConfirm
      isMobileScreen={isMobileScreen}
      title={modalActionData[modalOpen].title}
      subtitle={modalActionData[modalOpen].subtitle}
      actionBtnText={modalActionData[modalOpen].actionBtnText}
      action={modalActionData[modalOpen].action}
      avatar={userAvatarImg}
    />
  </ModalBackdrop>
)} */

  const acceptFormats =
    'image/jpeg, image/png, image/bmp, image/webp, image/avif, image/gif, video/mp4, video/webm';

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
      <div
        onClick={() => {
          mediaInputRef.current?.click();
        }}
        className={styles['upload-avatar']}
      >
        <AvatarImage AvatarImg={userAvatarImg} />
        <button className={styles['upload-avatar__btn']}>
          <CameraSvg className={styles['upload-avatar__icon']} />
        </button>
      </div>
      <input
        ref={mediaInputRef}
        type="file"
        accept={acceptFormats}
        style={{ display: 'none' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files;
          if (files && files[0]) {
            const file = files[0];

            if (file.type.startsWith('image/')) {
              /* const compressedFile = await compressImage(file); */
              const url = URL.createObjectURL(file);
              setAvatar({ imgUrl: url, name: file.name, fileObject: file });
              openModal();
            }
          }
          e.target.value = '';
        }}
      />
      {modalOpen && avatar && (
        //аргумент number в toggleModal - длительность transition opacity в modal-backdrop
        <ModalBackdrop
          toggleModal={() => toggleModal(false, 100)}
          divIdFromIndexHtml={'modal-backdrop'}
        >
          <ModalCropper isMobileScreen={isMobileScreen} image={avatar.imgUrl} />
        </ModalBackdrop>
      )}
    </>
  );
};

export default UploadAvatar;
