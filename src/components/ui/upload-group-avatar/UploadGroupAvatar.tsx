import { FC, useRef, useState } from 'react';
import { firebaseDatabase } from 'src/firebase';
import { ref as refFirebaseDatabase, set, update } from 'firebase/database';
import styles from './UploadGroupAvatar.module.scss';
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
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';
import { IFirebaseRtDbChat } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import { useDispatch } from 'react-redux';
import { setActiveChat, setActiveChatnameAndAvatar } from 'src/redux/slices/ActiveChatSlice';

interface UploadGroupAvatarProps {
  groupAvatar: string;
  uid: string;
  activeChatMembers: IMemberDetails[] | null;
  activeChatId: string | null;
}

interface IAvatar {
  name: string;
  fileObject: File;
}

const UploadGroupAvatar: FC<UploadGroupAvatarProps> = ({
  groupAvatar,
  uid,
  activeChatMembers,
  activeChatId,
}) => {
  const { isMobileScreen } = useMobileScreen();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<IAvatar | null>(null);
  const [uploadProgress, setUploadProgress] = useState<
    number | 'error' | false
  >(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const modalDuration = 100;
  const openModal = () => toggleModal(true);

  const acceptFormats =
    'image/jpeg, image/png, image/bmp, image/webp, image/avif';

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

  const createNewDataForChatsPath = (
    chatId: string,
    usersIds: string[],
    firebaseUrl: string,
  ) => {
    const updatesByUserChats = usersIds.reduce(
      (acc, userId) => {
        acc[`userChats/${userId}/chats/${chatId}/groupAvatar`] = firebaseUrl;
        return acc;
      },
      {} as Record<string, string>,
    );

    return updatesByUserChats;
  };

  const uploadAvatar = async (file: File) => {
    if (activeChatMembers === null || activeChatId === null) {
      return;
    }
    if (file) {
      const compressedFile = await compressImage(file);
      const firebaseUrl = await firebaseStorageFileUpload(compressedFile);
      if (typeof firebaseUrl === 'string') {

        const allUsersIds = activeChatMembers.map((user) => user.uid);

        const updates = createNewDataForChatsPath(
          activeChatId,
          allUsersIds,
          firebaseUrl,
        );

        await update(refFirebaseDatabase(firebaseDatabase), updates);

        dispatch(
          setActiveChatnameAndAvatar({
            activeChatAvatar: firebaseUrl,
          }),
        );
      }
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
        className={`${styles['upload-group-avatar']} ${typeof uploadProgress === 'number' ? styles['upload-group-avatar--loading'] : ''}`}
      >
        <AvatarImage AvatarImg={groupAvatar} isGroup />
        {uploadProgress === false && (
          <CameraSvg className={styles['upload-group-avatar__camera-icon']} />
        )}
        {uploadProgress === 'error' && (
          <div className={styles['upload-group-avatar__error-icon']}>!</div>
        )}

        {typeof uploadProgress === 'number' && (
          <div
            className={
              styles['upload-group-avatar__circular-progressbar-wrapper']
            }
          >
            <CircularProgressbar
              className={styles['upload-group-avatar__circular-progressbar']}
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
        <ModalBackdrop
          transitionDuration={modalDuration}
          toggleModal={() => toggleModal(false, modalDuration)}
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

export default UploadGroupAvatar;
