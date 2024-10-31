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
  updateIsCanceledKeyInMessage,
  updateProgressKeyInMessage,
  updateProgressPreviewKeyInMessage,
} from 'src/redux/slices/MessagesArraySlice';
import {
  ILoadingFile,
  ILoadingImgMedia,
  ILoadingMessage,
  ILoadingVideoMedia,
} from 'src/interfaces/LoadingMessage.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';

interface MessageInputWrapperProps {
  isMobileScreen: boolean;
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
  attachedItems: AttachedItemType[];
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
}

const MessageInputWrapper: FC<MessageInputWrapperProps> = ({
  isMobileScreen,
  setAttachedItems,
  attachedItems,
  uploadTasksRef,
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

    /* сохранение задачи и референса к файлу */
    if (!uploadTasksRef.current[messageId]) {
      uploadTasksRef.current[messageId] = {};
    }
    uploadTasksRef.current[messageId][loadingId] = {
      task: uploadTask,
      fileRef: storageRef,
    };

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
          dispatch(updateIsCanceledKeyInMessage({ messageId: messageId }));
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

    delete uploadTasksRef.current[messageWithLocaleUrl.messageId];

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
                  fileSize: fileOrMediaItem.fileSize,
                };
              }
            }),
          )
        : [];
    return {
      messageText: messageWithLocaleUrl.messageText,
      messageDateUTC: messageWithLocaleUrl.messageDateUTC,
      messageId: messageWithLocaleUrl.messageId,
      isChecked: messageWithLocaleUrl.isChecked,
      senderUid: messageWithLocaleUrl.senderUid,
      userAvatar: messageWithLocaleUrl.userAvatar,
      isEdited: false,
      isLoading: false,
      media: newFilesAndMediaArray.filter((item) => !('fileUrl' in item)) as (
        | IImgMedia
        | IVideoMedia
      )[],
      files: newFilesAndMediaArray.filter(
        (item) => 'fileUrl' in item,
      ) as IFile[],
    };
  };

  const createMessageObjectWithLocaleUrl = async (
    messageContentLocale: string,
    attachedItemsLocale: AttachedItemType[],
  ) => {
    /* создание полноценного массива объектов загруженных с устройства  */
    const newAttachedItems: (
      | ILoadingImgMedia
      | ILoadingVideoMedia
      | ILoadingFile
    )[] =
      attachedItemsLocale.length > 0
        ? await Promise.all(
            attachedItemsLocale.map(async (attachedItem) => {
              if ('imgUrl' in attachedItem) {
                const img = new Image();
                img.src = attachedItem.imgUrl;
                await new Promise((resolve) => {
                  img.onload = resolve;
                });
                const isHorizontal =
                  img.width > img.height || img.width === img.height;
                const isSquare = img.width === img.height;

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
                /* файлы */
                return {
                  fileUrl: '',
                  fileName: attachedItem.name,
                  fileSize: Math.round(attachedItem.fileObject.size / 1024), // KB - Килобайты
                  fileObject: attachedItem.fileObject,
                  progress: 0,
                  loadingId: uuidv4(),
                };
              }
            }),
          )
        : [];
    return {
      messageText: messageContentLocale,
      messageDateUTC: new Date().toISOString(),
      messageId: uuidv4(),
      isChecked: false,
      senderUid: uid!,
      userAvatar:
        'получать из database и ставить сразу в user редакса в useAuth и тд',
      isLoading: true,
      isCanceled: false,
      isEdited: false,
      media: newAttachedItems.filter((item) => !('fileUrl' in item)) as (
        | ILoadingImgMedia
        | ILoadingVideoMedia
      )[],
      files: newAttachedItems.filter(
        (item) => 'fileUrl' in item,
      ) as ILoadingFile[],
    };
  };

  const sendMessage = async (
    sendMessageContent: string,
    sendAttachedItemsLocale: AttachedItemType[],
  ) => {
    if (!uid) {
      return;
    }

    const messageWithLocaleUrls: ILoadingMessage | undefined =
      await createMessageObjectWithLocaleUrl(
        sendMessageContent,
        sendAttachedItemsLocale,
      );
    console.log(messageWithLocaleUrls);
    if (messageWithLocaleUrls !== undefined) {
      dispatch(addLoadingMessage(messageWithLocaleUrls));
      /* const messageWithFirebaseUrls = await createMessageObjectWithFirebaseUrl(
        messageWithLocaleUrls,
      ); */

      /* добавить дату отправки повторно перед отправкой */
      /* console.log(messageWithFirebaseUrls); */
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
        value={messageContent}
        placeholder="Сообщение"
        className={styles['message-input-wrapper__input']}
      />
      <button
        disabled={messageContent.length === 0 && attachedItems.length === 0}
        className={styles['message-input-wrapper__btn']}
        onClick={() => {
          sendMessage(messageContent, attachedItems);
          setAttachedItems([]);
          setMessageContent('');
        }}
      >
        <ArrowCircleSvg
          className={
            messageContent.length === 0 && attachedItems.length === 0
              ? styles['message-input-wrapper__arrow-icon']
              : `${styles['message-input-wrapper__arrow-icon']} ${styles['active']}`
          }
        />
      </button>
    </div>
  );
};

export default MessageInputWrapper;
