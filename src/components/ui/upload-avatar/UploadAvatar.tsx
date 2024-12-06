import { FC, useRef, useState } from 'react';
import styles from './UploadAvatar.module.scss';
import AvatarImage from '../avatar-image/AvatarImage';
import useToggleModal from 'src/hooks/useToggleModal';
import imageCompression from 'browser-image-compression';
import ModalBackdrop from '../modal-backdrop/ModalBackdrop';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CameraSvg from 'src/assets/images/icons/24x24-icons/Camera.svg?react';
import ModalCropper from '../modal-cropper/ModalCropper';
import { firebaseStorage } from 'src/firebase';
import { v4 as uuidv4 } from 'uuid';
import useMobileScreen from 'src/hooks/useMobileScreen';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

interface UploadAvatarProps {
  userAvatarImg: string;
}

interface IAvatar {
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

  const acceptFormats =
    'image/jpeg, image/png, image/bmp, image/webp, image/avif';

  /*   useEffect(() => {
    setUploadProgress(15);
  }, []); */

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

  const firebaseStorageFileUpload = async (file: File) => {
    const storageRef = ref(
      firebaseStorage,
      `users_uploads/${`${uuidv4()}_${file.name}`}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          /* отображение прогресса загрузки */
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          /* если !fileName - значит это не превью для видео */
          setUploadProgress(progress);
        },
        (error) => {
          console.log('Upload error:', error);
          setUploadProgress('error');
          reject(error);
        },
        async () => {
          /* Получение ссылки на загруженный файл */
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadProgress(false);
          resolve(downloadURL);
        },
      );
    });
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

  const uploadAvatar = async (file: File) => {
    if (file) {
      const compressedFile = await compressImage(file);
      const firebaseUrl = await firebaseStorageFileUpload(compressedFile);
      console.log(firebaseUrl);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (typeof uploadProgress !== 'number') {
            mediaInputRef.current?.click();
          }
        }}
        className={`${styles['upload-avatar']} ${typeof uploadProgress === 'number' ? styles['upload-avatar--loading'] : ''}`}
      >
        <AvatarImage AvatarImg={userAvatarImg} />
        {uploadProgress === false && (
          <CameraSvg className={styles['upload-avatar__camera-icon']} />
        )}
        {uploadProgress === 'error' && (
          <div className={styles['upload-avatar__error-icon']}>!</div>
        )}

        {typeof uploadProgress === 'number' && (
          <div
            className={styles['upload-avatar__circular-progressbar-wrapper']}
          >
            <CircularProgressbar
              className={styles['upload-avatar__circular-progressbar']}
              value={uploadProgress === 0 ? 1 : uploadProgress}
              styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                /* rotation: 0.25, */
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',
                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,
                // Colors
                pathColor: 'rgb(255, 255, 255)',
                /* textColor: '#f88', */
                trailColor: 'none',
              })}
            />
          </div>
        )}
      </button>
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
              setAvatar({ name: file.name, fileObject: file });
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
          <ModalCropper
            uploadAvatar={uploadAvatar}
            isMobileScreen={isMobileScreen}
            imageFile={avatar.fileObject}
          />
        </ModalBackdrop>
      )}
    </>
  );
};

export default UploadAvatar;
