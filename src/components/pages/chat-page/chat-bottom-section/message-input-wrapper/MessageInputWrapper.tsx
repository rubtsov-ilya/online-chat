import { FC, useEffect, useRef } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';
import ErrorSvg from 'src/assets/images/icons/24x24-icons/Error.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-menu/AttachMenu';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import useAuth from 'src/hooks/useAuth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  ref as refFirebaseDatabase,
  get,
  update,
  onDisconnect,
  push,
  serverTimestamp,
} from 'firebase/database';
import { firebaseDatabase, firebaseStorage } from 'src/firebase';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { useDispatch } from 'react-redux';
import {
  IFile,
  IImgMedia,
  IMessage,
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
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import useActiveChat from 'src/hooks/useActiveChat';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbChatsChat,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import {
  setActiveChat,
  setActiveChatId,
} from 'src/redux/slices/ActiveChatSlice';
import {
  ChatInputValue,
  clearChatInputValue,
  updateChatInputValue,
} from 'src/redux/slices/ChatInputValuesSlice';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';

interface MessageInputWrapperProps {
  chatInputValues: { [chatId: string]: ChatInputValue };
  isSubscribeLoading: boolean;
  isMobileScreen: boolean;
  attachedItems: AttachedItemType[];
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  locationState: ILocationChatPage | null;
  updateAttachedItems: (state: AttachedItemType[]) => void;
}

const MessageInputWrapper: FC<MessageInputWrapperProps> = ({
  chatInputValues,
  isSubscribeLoading,
  isMobileScreen,
  attachedItems,
  uploadTasksRef,
  locationState,
  updateAttachedItems,
}) => {
  const isWritingByChatsUpdatedRef = useRef<{ [chatId: string]: boolean }>({});
  const { uid, avatar, username, blocked } = useAuth();
  const {
    activeChatId,
    activeChatMembers,
    activeChatBlocked,
    activeChatIsGroup,
  } = useActiveChat();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  const messageText =
    activeChatId !== null && chatInputValues[activeChatId] != null
      ? chatInputValues[activeChatId].messageText
      : chatInputValues['localeState'].messageText; // localeState - initialState if (chatId === null)

  // статус заблокирован ли чат. только для негрупповых чатов, в групповом присваивается false
  const otherMemberUid = activeChatMembers?.find(
    (member) => member.uid !== uid,
  )?.uid;
  const isBlocked =
    activeChatIsGroup === false
      ? otherMemberUid !== undefined &&
        activeChatBlocked !== null &&
        blocked !== null &&
        (blocked.includes(otherMemberUid) || activeChatBlocked.includes(uid!))
      : false;

  useEffect(() => {
    // обновление статуса writingUsers
    const updateIsWriting = async () => {
      if (activeChatId === null) return;
      const wasWriting =
        isWritingByChatsUpdatedRef.current[activeChatId] ?? false;
      if (messageText.length > 0 && !wasWriting) {
        // если статус не печатает и длинна текста больше 0 - поставить true = печатает
        await update(refFirebaseDatabase(firebaseDatabase), {
          [`chats/${activeChatId}/writingUsers/${uid}`]: true,
        });
        isWritingByChatsUpdatedRef.current[activeChatId] = true;
      }

      if (messageText.length === 0 && wasWriting) {
        // если статус печатает и длинна текста 0 - поставить null = не печатает
        await update(refFirebaseDatabase(firebaseDatabase), {
          [`chats/${activeChatId}/writingUsers/${uid}`]: null,
        });
        isWritingByChatsUpdatedRef.current[activeChatId] = false;
      }
    };

    updateIsWriting();
  }, [messageText, activeChatId]);

  useEffect(() => {
    if (activeChatId === null) return;
    const wasWriting =
      isWritingByChatsUpdatedRef.current[activeChatId] ?? false;
    if (wasWriting) {
    }
    // Устанавливаем onDisconnect для автоматического обновления, если соединение разорвется
    const writingStatusRef = refFirebaseDatabase(
      firebaseDatabase,
      `chats/${activeChatId}/writingUsers/${uid}`,
    );
    onDisconnect(writingStatusRef).set(null); // Это сработает при потере соединения или выходе со страницы

    return () => {
      // срабатывает при смене айди чата или выходе со страницы chats/chat
      const updateWritingStatusOnChatChange = async () => {
        if (activeChatId === null) return;
        const wasWriting =
          isWritingByChatsUpdatedRef.current[activeChatId] ?? false;
        if (wasWriting) {
          // если статус печатает, поставить null = не печатает
          await update(refFirebaseDatabase(firebaseDatabase), {
            [`chats/${activeChatId}/writingUsers/${uid}`]: null,
          });
          isWritingByChatsUpdatedRef.current[activeChatId] = false;
        }
      };
      updateWritingStatusOnChatChange();
    };
  }, [activeChatId]);

  useEffect(() => {
    if (activeChatId === null) return;
    // Устанавливаем onDisconnect для автоматического обновления при потере соединения
    const writingStatusRef = refFirebaseDatabase(
      firebaseDatabase,
      `chats/${activeChatId}/writingUsers/${uid}`,
    );
    onDisconnect(writingStatusRef).set(null);

    return () => {
      // обновления статуса при смене чата

      // Отменяем onDisconnect для текущего чата
      onDisconnect(writingStatusRef).cancel();

      const updateWritingStatusOnChatChange = async () => {
        if (activeChatId === null) return;
        // проверяем, был ли пользователь в статусе "печатает"
        const wasWriting =
          isWritingByChatsUpdatedRef.current[activeChatId] ?? false;
        if (wasWriting) {
          // если статус печатает, поставить null = не печатает
          await update(refFirebaseDatabase(firebaseDatabase), {
            [`chats/${activeChatId}/writingUsers/${uid}`]: null,
          });
          isWritingByChatsUpdatedRef.current[activeChatId] = false;
        }
      };

      updateWritingStatusOnChatChange();
    };
  }, [activeChatId]);

  useAutosizeTextArea(textAreaRef.current, messageText, 130);

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
  ): Promise<IMessage | undefined> => {
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
      messageDateUTC: serverTimestamp(),
      messageId: messageWithLocaleUrl.messageId,
      isDeleted: messageWithLocaleUrl.isDeleted,
      isChecked: messageWithLocaleUrl.isChecked,
      senderUid: messageWithLocaleUrl.senderUid,
      isEdited: false,
      isLoading: false,
      answerToMessage: messageWithLocaleUrl.answerToMessage,
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
    messageTextLocale: string,
    attachedItemsLocale: AttachedItemType[],
    chatId: string,
  ): Promise<ILoadingMessage | undefined> => {
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
    const messagesRef = refFirebaseDatabase(
      firebaseDatabase,
      `chats/${chatId}/messages`,
    );
    const messageId = push(messagesRef).key;
    if (messageId === null) {
      return;
    }
    return {
      messageText: messageTextLocale,
      messageDateUTC: Date.now(),
      messageId: messageId,
      isDeleted: false,
      isChecked: false,
      senderUid: uid!,
      isLoading: true,
      isCanceled: false,
      isEdited: false,
      answerToMessage: '',
      media: newAttachedItems.filter((item) => !('fileUrl' in item)) as (
        | ILoadingImgMedia
        | ILoadingVideoMedia
      )[],
      files: newAttachedItems.filter(
        (item) => 'fileUrl' in item,
      ) as ILoadingFile[],
    };
  };

  const createNewDataForChatsPath = (
    chatId: string,
    locationStateUid: string,
    messageText: string,
  ) => {
    const newChatsData: IFirebaseRtDbChat = {
      chatId: chatId,
      membersIds: { [uid!]: true, [locationStateUid]: true },
      lastMessageText: messageText,
      lastMessageDateUTC: serverTimestamp(),
      lastMessageIsChecked: false,
      lastMessageSenderUid: uid!,
      groupChatname: '',
      groupAvatar: '',
      groupAdminUid: '',
      isGroup: false,
    };

    const updatesByUserChats = {
      [`userChats/${uid!}/chats/${chatId}`]: newChatsData,
      [`userChats/${locationStateUid}/chats/${chatId}`]: newChatsData,
    };

    return { updatesByUserChats: updatesByUserChats, chatId: chatId };
  };

  const createNewChatForUserChatsPath = async (
    sendedMessageText: string,
    newChatId: string,
  ) => {
    // функция вызывается только если locationState !== null
    // возвращает string если пользователь найден и чат либо создан, либо уже существовал
    // возвращает undefined в случае ошибок, либо не найден пользователь, либо catch
    try {
      const existingChatsByUser = refFirebaseDatabase(
        firebaseDatabase,
        `userChats/${uid}/chats`,
      );
      const existingChatsByUserSnapshot = await get(existingChatsByUser);

      if (existingChatsByUserSnapshot.exists()) {
        const existingChatsByUserValue = Object.values(
          existingChatsByUserSnapshot.val(),
        ) as IFirebaseRtDbChat[];
        const existingChatWithUser = existingChatsByUserValue.find(
          (chat) =>
            chat.isGroup === false &&
            Object.keys(chat.membersIds).includes(
              locationState!.userUidFromGlobalSearch,
            ),
        );
        // если чат существует, установить его айди в активный чат rtk и вернуть айди
        if (existingChatWithUser !== undefined) {
          dispatch(
            setActiveChatId({ activeChatId: existingChatWithUser.chatId }),
          );
          return {
            updatesByUserChats: undefined,
            chatId: existingChatWithUser.chatId,
          };
        } else if (existingChatWithUser === undefined) {
          // если чата нет, создать новый
          const createdNewDataForChatsPath = createNewDataForChatsPath(
            newChatId,
            locationState!.userUidFromGlobalSearch,
            sendedMessageText,
          );
          return createdNewDataForChatsPath;
        }
      } else if (!existingChatsByUserSnapshot.exists()) {
        const createdNewDataForChatsPath = createNewDataForChatsPath(
          newChatId,
          locationState!.userUidFromGlobalSearch,
          sendedMessageText,
        );
        return createdNewDataForChatsPath;

        // проверить есть ли чат не групповой где только ты и он. Затем создать чат и тебе и ему. Иначе ретёрн. Можно даже отправку смс прервать в случае ошибки благодаря ретёрну с 'error'
      } else {
        return;
      }
    } catch (error) {
      console.error(`Ошибка при получении данных о чатах пользователя`, error);
      return;
    }
  };

  const createNewChatForChatsPath = async (
    chatId: string,
    messageWithFirebaseUrls: IMessage,
    userUidFromGlobalSearch: string,
  ) => {
    const existingChatByChats = refFirebaseDatabase(
      firebaseDatabase,
      `chats/${chatId}/`,
    );
    const existingChatByChatsSnapshot = await get(existingChatByChats);

    if (existingChatByChatsSnapshot.exists()) {
      // если чат существует, вернуть undefined
      return;
    }

    const newChatData: IFirebaseRtDbChatsChat = {
      chatId: chatId,
      unreadMessages: {
        [userUidFromGlobalSearch]: {
          [messageWithFirebaseUrls.messageId]: true,
        },
      },
      messages: {
        [messageWithFirebaseUrls.messageId]: messageWithFirebaseUrls,
      },
    };

    const chatUpdatesByChats = {
      [`chats/${chatId}`]: newChatData,
    };

    return chatUpdatesByChats;
  };

  const createUpdatesChatForUserChatsPath = (
    chatId: string,
    sendedMessageText: string,
    membersIds: string[],
  ) => {
    const newChatsData = {
      lastMessageText: sendedMessageText,
      lastMessageDateUTC: serverTimestamp(),
      lastMessageIsChecked: false,
      lastMessageSenderUid: uid!,
    };

    const updatesByUserChats = membersIds.reduce(
      (acc, memberId) => {
        acc[`userChats/${memberId}/chats/${chatId}/lastMessageText`] =
          newChatsData.lastMessageText;
        acc[`userChats/${memberId}/chats/${chatId}/lastMessageDateUTC`] =
          newChatsData.lastMessageDateUTC;
        acc[`userChats/${memberId}/chats/${chatId}/lastMessageIsChecked`] =
          newChatsData.lastMessageIsChecked;
        acc[`userChats/${memberId}/chats/${chatId}/lastMessageSenderUid`] =
          newChatsData.lastMessageSenderUid;
        return acc;
      },
      {} as Record<string, any>,
    );

    return updatesByUserChats;
  };

  const createUpdatesChatForChatsPath = (
    chatId: string,
    messageWithFirebaseUrls: IMessage,
    membersIds: string[],
  ) => {
    const filteredMembersIds = membersIds.filter(
      (memberId) => memberId !== uid,
    );
    const unreadMessages = filteredMembersIds.reduce(
      (acc, memberId) => {
        acc[
          `chats/${chatId}/unreadMessages/${memberId}/${messageWithFirebaseUrls.messageId}`
        ] = true;
        return acc;
      },
      {} as Record<string, any>,
    );

    const updatesByChats = {
      [`chats/${chatId}/messages/${messageWithFirebaseUrls.messageId}`]:
        messageWithFirebaseUrls,
      ...unreadMessages,
    };

    return updatesByChats;
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

  const onTextAreaPasteCapture = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const items = e.clipboardData.items;
    const newItems = await Promise.all(
      Array.from(items).map(async (item) => {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            if (file.size > MAX_UPLOAD_FILE_SIZE) {
              customToastError('Максимальный размер 50MB');
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
      updateAttachedItems(filteredItems);
    }
  };

  const sendMessageOrCreateNewChat = async (
    sendedMessageText: string,
    sendedAttachedItemsLocale: AttachedItemType[],
    sendedlocationState: ILocationChatPage | null,
  ) => {
    if (!uid) {
      return;
    }
    if (
      isSubscribeLoading === true ||
      (sendedMessageText.trim().length === 0 &&
        sendedAttachedItemsLocale.length === 0)
    ) {
      return;
    }
    // СОЗДАТЬ НЕ ГРУППОВОЙ ЧАТ. Групповой создаётся не через отправку смс пользователю
    // если страница chat открыта переходом из глобального поиска, т.е. не созданный ранее чат
    if (sendedlocationState !== null && activeChatId === null) {
      const newChatId = uuidv4();
      const messageWithLocaleUrls: ILoadingMessage | undefined =
        await createMessageObjectWithLocaleUrl(
          sendedMessageText,
          sendedAttachedItemsLocale,
          newChatId,
        );

      if (messageWithLocaleUrls === undefined) {
        return;
      }

      dispatch(addLoadingMessage(messageWithLocaleUrls));
      dispatch(
        clearChatInputValue({
          chatId: activeChatId,
        }),
      );

      const updatesByUsers = await createNewChatForUserChatsPath(
        sendedMessageText,
        newChatId,
      ); // вернёт либо объект созданного чата + айди, либо пустой объект чата + айди. либо undefined в случае ошибки
      if (updatesByUsers === undefined) {
        return;
      }

      const { updatesByUserChats, chatId } = updatesByUsers;
      if (updatesByUserChats !== undefined) {
        // если updatesByUserChats !== undefined, тогда чат не существует и нужно создать чат с сообщением первым
        const messageWithFirebaseUrls =
          await createMessageObjectWithFirebaseUrl(messageWithLocaleUrls);

        if (messageWithFirebaseUrls === undefined) {
          return;
        }
        const updatesByChats = await createNewChatForChatsPath(
          chatId,
          messageWithFirebaseUrls,
          sendedlocationState.userUidFromGlobalSearch,
        );

        if (updatesByChats === undefined) {
          return;
        }

        const updates = { ...updatesByUserChats, ...updatesByChats };

        await update(refFirebaseDatabase(firebaseDatabase), updates);
        const membersDetails: IMemberDetails[] = [
          { uid: uid, username: username!, avatar: avatar!, blocked: blocked! },
          {
            uid: sendedlocationState.userUidFromGlobalSearch,
            username: sendedlocationState.chatnameFromGlobalSearch,
            avatar: sendedlocationState.chatAvatarFromGlobalSearch,
            blocked: [],
          },
        ]; // blocked у второго пользователя будет установлен подпиской в chatpage
        dispatch(
          setActiveChat({
            activeChatId: newChatId,
            activeChatAvatar: sendedlocationState.chatAvatarFromGlobalSearch,
            activeChatname: sendedlocationState.chatnameFromGlobalSearch,
            activeChatIsGroup: false,
            activeChatMembers: membersDetails,
            activeChatBlocked: [],
            activeChatGroupAdminUrl: '',
          }),
        );
      }
      // ОТПРАВИТЬ СООБЩЕНИЕ, если при создании чата уже был создан чат ранее вторым пользователем
      if (updatesByUserChats === undefined) {
        // если updatesByUserChats === undefined; то чат существует и вернётся его айди и оно установится в RTK
        /* ПРОВЕРИТЬ БУДЕТ ЛИ ОТПРАВКА СМС ОТСЮДА ИЛИ СНИЗУ СРАЗУ ИЗ РТК ПОДХВАТИТ ИЗМЕНЕНИЕ */
      }
    } // ОТПРАВИТЬ СООБЩЕНИЕ
    else if (activeChatId !== null && activeChatMembers !== null) {
      // если activeChatId и activeChatMembers есть, тогда отправить смс в чат существующий
      const messageWithLocaleUrls: ILoadingMessage | undefined =
        await createMessageObjectWithLocaleUrl(
          sendedMessageText,
          sendedAttachedItemsLocale,
          activeChatId,
        );

      if (messageWithLocaleUrls === undefined) {
        return;
      }

      dispatch(addLoadingMessage(messageWithLocaleUrls));
      dispatch(
        clearChatInputValue({
          chatId: activeChatId,
        }),
      );
      const messageWithFirebaseUrls = await createMessageObjectWithFirebaseUrl(
        messageWithLocaleUrls,
      );

      if (messageWithFirebaseUrls === undefined) {
        return;
      }
      const activeMemberIds = activeChatMembers.map((member) => member.uid);
      const updatesByUserChats = createUpdatesChatForUserChatsPath(
        activeChatId,
        sendedMessageText,
        activeMemberIds,
      );
      const updatesByChats = createUpdatesChatForChatsPath(
        activeChatId,
        messageWithFirebaseUrls,
        activeMemberIds,
      );
      const updates = { ...updatesByUserChats, ...updatesByChats };
      await update(refFirebaseDatabase(firebaseDatabase), updates);
    }
  };

  return (
    <div className={styles['message-input-wrapper']}>
      {!isBlocked && !isSubscribeLoading && (
        <>
          <AttachMenu
            updateAttachedItems={updateAttachedItems}
            isAttachedItems={attachedItems.length > 0}
            isMobileScreen={isMobileScreen}
          />
          <textarea
            rows={1}
            ref={textAreaRef}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              dispatch(
                updateChatInputValue({
                  chatId: activeChatId,
                  messageText: e.target.value,
                }),
              )
            }
            onPasteCapture={onTextAreaPasteCapture}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !isMobileScreen && !e.shiftKey) {
                e.preventDefault();
                sendMessageOrCreateNewChat(
                  messageText,
                  attachedItems,
                  locationState,
                );
              }
            }}
            value={messageText}
            placeholder="Сообщение"
            className={styles['message-input-wrapper__textarea']}
          />
          <button
            disabled={
              messageText.trim().length === 0 && attachedItems.length === 0
            }
            className={styles['message-input-wrapper__btn']}
            onClick={() => {
              sendMessageOrCreateNewChat(
                messageText,
                attachedItems,
                locationState,
              );
            }}
          >
            <ArrowCircleSvg
              className={
                messageText.trim().length === 0 && attachedItems.length === 0
                  ? styles['message-input-wrapper__arrow-icon']
                  : `${styles['message-input-wrapper__arrow-icon']} ${styles['active']}`
              }
            />
          </button>
        </>
      )}
      {isBlocked && !isSubscribeLoading && (
        <div className={styles['message-input-wrapper__sub-wrapper']}>
          <ErrorSvg className={styles['message-input-wrapper__error-icon']} />
          <span className={styles['message-input-wrapper__blocked-text']}>
            Отправка сообщений ограничена
          </span>
        </div>
      )}
      {isSubscribeLoading && (
        <div className={styles['message-input-wrapper__sub-wrapper']}></div>
      )}
    </div>
  );
};

export default MessageInputWrapper;
