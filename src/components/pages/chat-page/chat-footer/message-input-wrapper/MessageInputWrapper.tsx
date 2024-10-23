import { FC, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-menu/AttachMenu';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import useAuth from 'src/hooks/useAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from 'src/firebase';

import { v4 as uuidv4 } from 'uuid';
import { addLoadingMessage } from 'src/redux/slices/LoadingMessagesSlice';
import { useDispatch } from 'react-redux';
import {
  IFile,
  IImgMedia,
  IVideoMedia,
} from 'src/interfaces/Message.interface';

interface MessageInputWrapperProps {
  isMobileScreen: boolean;
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
  attachedItems: AttachedItemType[];
}

const MessageInputWrapper: FC<MessageInputWrapperProps> = ({
  isMobileScreen,
  setAttachedItems,
  attachedItems,
}) => {
  const [messageContent, setMessageContent] = useState<string>('');
  const { uid } = useAuth();
  const dispatch = useDispatch();

  const firebaseStorageFileUpload = async (
    file: File | Blob,
    fileName?: string,
  ) => {
    const storageRef = ref(
      firebaseStorage,
      `users_uploads/${'name' in file ? `${uuidv4()}_${file.name}` : `preview_${uuidv4()}_${fileName}`}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // отображение прогресса загрузки
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log('Upload error:', error);
          reject(error);
        },
        async () => {
          // Получение ссылки на загруженный файл
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  };

  const createMessageObject = async (/* messageContent, attachedItems */) => {
    /* создание полноценного массива объектов загруженных с устройства  */
    if (!uid) {
      return;
    }
    const newAttachedItems: (IImgMedia | IVideoMedia | IFile)[] =
      attachedItems.length > 0
        ? await Promise.all(
            attachedItems.map(async (attachedItem) => {
              if ('imgUrl' in attachedItem) {
                const img = new Image();
                img.src = attachedItem.imgUrl;
                await new Promise((resolve) => {
                  img.onload = resolve;
                });
                const isHorizontal =
                  img.width > img.height || img.width === img.height;
                const isSquare = img.width === img.height;

                const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    attachedItem.fileObject,
                  )) as string;

                return {
                  imgUrl: firebaseStorageDownloadUrl,
                  isHorizontal,
                  isSquare,
                };
              } else if ('videoUrl' in attachedItem) {
                const video = document.createElement('video');
                video.src = attachedItem.videoUrl;
                await new Promise((resolve) => {
                  video.onloadedmetadata = resolve;
                });

                // измерение горизонтальности и квадратности
                const isHorizontal =
                  video.videoWidth > video.videoHeight ||
                  video.videoWidth === video.videoHeight;
                const isSquare = video.videoWidth === video.videoHeight;

                // создание canvas для работы с превью
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // ожидание загрузки видео до первого кадра
                await new Promise((resolve, reject) => {
                  video.currentTime = 0;
                  video.onseeked = () => {
                    resolve(null);
                  };
                  video.onerror = (err) => {
                    reject(err);
                  };
                });

                // отрисовка первого кадра в canvas

                if (!ctx) {
                  throw new Error('2D context не был создан');
                }

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Создание превью через canvas
                const videoPreview: Blob = await new Promise((resolve) => {
                  canvas.toBlob((blob) => {
                    if (blob) {
                      resolve(blob);
                    }
                  }, 'image/png'); // указать нужный формат, здесь '.png'
                });

                const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    attachedItem.fileObject,
                  )) as string;

                const firebaseStorageDownloadUrlPreview =
                  (await firebaseStorageFileUpload(
                    videoPreview,
                    attachedItem.name, //передача имени, т.к. сам блоб не имеем названия
                  )) as string;

                return {
                  videoUrl: firebaseStorageDownloadUrl,
                  isHorizontal,
                  isSquare,
                  videoPreview: firebaseStorageDownloadUrlPreview,
                };
              } else {
                const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    attachedItem.fileObject,
                  )) as string;
                return {
                  fileUrl: firebaseStorageDownloadUrl,
                  fileName: attachedItem.name,
                };
              }
            }),
          )
        : [];
    return {
      messageText: messageContent,
      messageDateUTC: '',
      messageId: uuidv4(),
      isChecked: false,
      senderUid: uid, // определять isOwn сообщение или !isOvwn
      userAvatar:
        'получать из database и ставить сразу в user редакса в useAuth и тд',
      media: newAttachedItems.filter((item) => !('fileUrl' in item)) as (
        | IImgMedia
        | IVideoMedia
      )[],
      files: newAttachedItems.filter((item) => 'fileUrl' in item) as IFile[],
    };
  };

  const addDateToMessageObject = async () => {
    const messageObjectWithoutDate = await createMessageObject();
    // получение даты в UTC +0 только после загрузки всех файлов в firebase, чтобы не было отстования даты после отправки

    if (messageObjectWithoutDate != undefined) {
      messageObjectWithoutDate.messageDateUTC = new Date().toISOString();
      dispatch(addLoadingMessage(messageObjectWithoutDate));
    }
  };

  return (
    <div className={styles['message-input-wrapper']}>
      <AttachMenu
        setAttachedItems={setAttachedItems}
        isAttachedItems={attachedItems.length > 0}
        isMobileScreen={isMobileScreen}
      />
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessageContent(e.target.value)
        }
        placeholder="Напишите сообщение..."
        className={styles['message-input-wrapper__input']}
      />
      <button
        disabled={messageContent.length === 0 && attachedItems.length === 0}
        className={styles['message-input-wrapper__btn']}
        onClick={addDateToMessageObject}
      >
        <ArrowCircleSvg
          className={
            messageContent.length === 0 && attachedItems.length === 0
              ? styles['message-input-wrapper__arrow-icon']
              : `${styles['message-input-wrapper__arrow-icon']} ${styles['active']}`
          }
        />
      </button>
      {/* {first && <img src={first} alt="" />} */}
    </div>
  );
};

export default MessageInputWrapper;
