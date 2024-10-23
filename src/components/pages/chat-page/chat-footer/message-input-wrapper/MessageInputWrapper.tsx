import { FC, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-menu/AttachMenu';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import useAuth from 'src/hooks/useAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from 'src/firebase';

import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import {
  IFile,
  IImgMedia,
  IVideoMedia,
} from 'src/interfaces/Message.interface';
import {
  addLoadingMessage,
  updateProgressKeyInMessage,
  updateProgressPreviewKeyInMessage,
} from 'src/redux/slices/MessagesArraySlice';
import {
  ILoadingFile,
  ILoadingImgMedia,
  ILoadingMessage,
  ILoadingVideoMedia,
} from 'src/interfaces/LoadingMessage.interface';

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
    filePath: 'media' | 'files',
    messageId: string,
    loadingId: string,
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
          /* отображение прогресса загрузки */
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          /* если !fileName - значит это не превью для видео */
          if (!fileName) {
            dispatch(
              updateProgressKeyInMessage({
                messageId: messageId,
                loadingId: loadingId,
                progress: progress,
                filePath: filePath,
              }),
            );
          }
          if (fileName) {
            dispatch(
              updateProgressPreviewKeyInMessage({
                messageId: messageId,
                loadingId: loadingId,
                progress: progress,
              }),
            );
          }
        },
        (error) => {
          console.log('Upload error:', error);
          reject(error);
        },
        async () => {
          /* Получение ссылки на загруженный файл */
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  };

  const createMessageObjectWithFirebaseUrl = async (
    messageWithLocaleUrl: ILoadingMessage,
  ) => {
    if (!uid) {
      return;
    }

    const filesAndMediaArray = [
      ...messageWithLocaleUrl.media,
      ...messageWithLocaleUrl.files,
    ];

    const newFilesAndMediaArray: (IImgMedia | IVideoMedia | IFile)[] =
      filesAndMediaArray.length > 0
        ? await Promise.all(
            filesAndMediaArray.map(async (fileOrMediaItem) => {
              if ('imgUrl' in fileOrMediaItem) {
                const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    fileOrMediaItem.fileObject,
                    'media',
                    messageWithLocaleUrl.messageId,
                    fileOrMediaItem.loadingId,
                  )) as string;

                return {
                  imgUrl: firebaseStorageDownloadUrl,
                  isHorizontal: fileOrMediaItem.isHorizontal,
                  isSquare: fileOrMediaItem.isSquare,
                };
              } else if ('videoUrl' in fileOrMediaItem) {
                const video = document.createElement('video');
                video.src = fileOrMediaItem.videoUrl;
                await new Promise((resolve) => {
                  video.onloadedmetadata = resolve;
                });

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
                    fileOrMediaItem.fileObject,
                    'media',
                    messageWithLocaleUrl.messageId,
                    fileOrMediaItem.loadingId,
                  )) as string;

                const firebaseStorageDownloadUrlPreview =
                  (await firebaseStorageFileUpload(
                    videoPreview,
                    'media',
                    messageWithLocaleUrl.messageId,
                    fileOrMediaItem.loadingId,
                    fileOrMediaItem.videoName, //передача имени, т.к. сам блоб не имеем названия
                  )) as string;

                return {
                  videoUrl: firebaseStorageDownloadUrl,
                  videoPreview: firebaseStorageDownloadUrlPreview,
                  isHorizontal: fileOrMediaItem.isHorizontal,
                  isSquare: fileOrMediaItem.isSquare,
                };
              } else {
                const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    fileOrMediaItem.fileObject,
                    'files',
                    messageWithLocaleUrl.messageId,
                    fileOrMediaItem.loadingId,
                  )) as string;
                return {
                  fileUrl: firebaseStorageDownloadUrl,
                  fileName: fileOrMediaItem.fileName,
                };
              }
            }),
          )
        : [];
  };

  const createMessageObjectWithLocaleUrl =
    async (/* messageContent, attachedItems */) => {
      /* создание полноценного массива объектов загруженных с устройства  */
      const newAttachedItems: (
        | ILoadingImgMedia
        | ILoadingVideoMedia
        | ILoadingFile
      )[] =
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

                  /* const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    attachedItem.fileObject,
                  )) as string; */

                  return {
                    imgUrl: attachedItem.imgUrl,
                    isHorizontal,
                    isSquare,
                    fileObject: attachedItem.fileObject,
                    progress: 0,
                    loadingId: uuidv4(),
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
                  /* const canvas = document.createElement('canvas');
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
                  )) as string; */

                  return {
                    videoUrl: attachedItem.videoUrl,
                    isHorizontal,
                    isSquare,
                    videoPreview: '',
                    videoName: attachedItem.name,
                    fileObject: attachedItem.fileObject,
                    progress: 0,
                    progressPreview: 0,
                    loadingId: uuidv4(),
                  };
                } else {
                  /* const firebaseStorageDownloadUrl =
                  (await firebaseStorageFileUpload(
                    attachedItem.fileObject,
                  )) as string; */
                  return {
                    fileUrl: '',
                    fileName: attachedItem.name,
                    fileObject: attachedItem.fileObject,
                    progress: 0,
                    loadingId: uuidv4(),
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
        senderUid: uid!, // определять isOwn сообщение или !isOvwn
        userAvatar:
          'получать из database и ставить сразу в user редакса в useAuth и тд',
        isLoading: true,
        media: newAttachedItems.filter((item) => !('fileUrl' in item)) as (
          | ILoadingImgMedia
          | ILoadingVideoMedia
        )[],
        files: newAttachedItems.filter(
          (item) => 'fileUrl' in item,
        ) as ILoadingFile[],
      };
    };

  const sendMessage = async () => {
    if (!uid) {
      return;
    }

    const messageWithLocaleUrls: ILoadingMessage | undefined =
      await createMessageObjectWithLocaleUrl();

    if (messageWithLocaleUrls != undefined) {
      dispatch(addLoadingMessage(messageWithLocaleUrls));
      const messageWithFirebaseUrls = await createMessageObjectWithFirebaseUrl(
        messageWithLocaleUrls,
      );
    }

    /* добавление даты в UTC +0 только после загрузки всех файлов в firebase (прямо перед отправкой в фаербейз), чтобы не было отстования даты после отправки */
    /* ещё зависит от того, выдатс ли ошибку фаербейз при отпадании интернета или нет, если нет, то он потом отправит задним числом, тогда дату придётся серверной функцией добавлять */
    /* messageWithFirebaseUrls.messageDateUTC = new Date().toISOString(); */

    /* поставить состояние загрузки false */

    /* messageWithFirebaseUrls.isLoading = false; */
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
        onClick={sendMessage}
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
