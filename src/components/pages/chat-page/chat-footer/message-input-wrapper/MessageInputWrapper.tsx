import { FC, useRef, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-menu/AttachMenu';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import useAuth from 'src/hooks/useAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from 'src/firebase';

import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
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
import useAutosizeTextArea from 'src/hooks/useAutosizeTextArea';
import { MAX_UPLOAD_FILE_SIZE } from 'src/constants';
import { customToastError } from 'src/components/ui/custom-toast-container/CustomToastContainer';

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { uid } = useAuth();
  const dispatch = useDispatch();

  useAutosizeTextArea(textAreaRef.current, messageContent, 130);

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
      isDeleted: messageWithLocaleUrl.isDeleted,
      isChecked: messageWithLocaleUrl.isChecked,
      senderUid: messageWithLocaleUrl.senderUid,
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
      isDeleted: false,
      isChecked: false,
      senderUid: uid!,
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
    <div className={styles['message-input-wrapper']}>
      <AttachMenu
        setAttachedItems={setAttachedItems}
        isAttachedItems={attachedItems.length > 0}
        isMobileScreen={isMobileScreen}
      />
      <textarea
        rows={1}
        ref={textAreaRef}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setMessageContent(e.target.value)
        }
        onPasteCapture={async (
          e: React.ClipboardEvent<HTMLTextAreaElement>,
        ) => {
          const items = e.clipboardData.items;
          const newItems = await Promise.all(
            Array.from(items).map(async (item) => {
              if (item.kind === 'file' && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                  if (file.size > MAX_UPLOAD_FILE_SIZE) {
                    customToastError("Максимальный размер 50MB");
                    return null; // Если файл слишком большой, возвращаем null
                  }
                  const compressedFile = await compressImage(file);
                  const url = URL.createObjectURL(compressedFile);
                  return {
                    imgUrl: url,
                    name: file.name,
                    fileObject: compressedFile,
                  };
                }
              }
              return null; // Возвращаем null для несуществующих файлов
            }),
          );

          // Фильтруем массив, убирая все null значения
          const filteredItems = newItems.filter(
            (item) => item !== null,
          ) as AttachedItemType[];

          if (filteredItems.length > 0) {
            setAttachedItems((prevItems) => [...prevItems, ...filteredItems]);
          }
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !isMobileScreen && !e.shiftKey) {
            e.preventDefault();
            if (
              messageContent.trim().length === 0 &&
              attachedItems.length === 0
            ) {
              return;
            }
            sendMessage(messageContent, attachedItems);
            setAttachedItems([]);
            setMessageContent('');
          }
        }}
        value={messageContent}
        placeholder="Сообщение"
        className={styles['message-input-wrapper__textarea']}
      />
      <button
        disabled={
          messageContent.trim().length === 0 && attachedItems.length === 0
        }
        className={styles['message-input-wrapper__btn']}
        onClick={() => {
          if (
            messageContent.trim().length === 0 &&
            attachedItems.length === 0
          ) {
            return;
          }
          sendMessage(messageContent, attachedItems);
          setAttachedItems([]);
          setMessageContent('');
        }}
      >
        <ArrowCircleSvg
          className={
            messageContent.trim().length === 0 && attachedItems.length === 0
              ? styles['message-input-wrapper__arrow-icon']
              : `${styles['message-input-wrapper__arrow-icon']} ${styles['active']}`
          }
        />
      </button>
    </div>
  );
};

export default MessageInputWrapper;
