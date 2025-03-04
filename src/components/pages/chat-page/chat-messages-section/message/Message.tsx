import { FC, useState } from 'react';

import styles from './Message.module.scss';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import Linkify from 'linkify-react';
import MessageMediaItem from '../message-media-item/MessageMediaItem';
import MessageFileItem from '../message-file-item/MessageFileItem';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';
import { IMessage } from 'src/interfaces/Message.interface';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import {
  IUploadTaskWithRef,
  IUploadTasksRef,
} from 'src/interfaces/UploadTasks.interface';
import { deleteObject } from 'firebase/storage';
import useActiveChat from 'src/hooks/useActiveChat';
import {
  USERNAME_LEAVED_VALUE,
  USER_AVATAR_DEFAULT_VALUE,
} from 'src/constants';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import MessageContextBackdrop from '../message-context-backdrop/MessageContextBackdrop';

interface MessageProps {
  messageData: IMessage | ILoadingMessage;
  isLastOfGroup: boolean;
  isFirstOfGroup: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  uid: string;
  messageIndex: number;
}

const Message: FC<MessageProps> = ({
  uid,
  messageData,
  isLastOfGroup,
  isFirstOfGroup,
  uploadTasksRef,
  messageIndex,
}) => {
  const [сontextMenuActive, setContextMenuActive] = useState<{
    positionY: number;
    positionX: number;
    backdropHeight: number;
    backdropWidth: number;
    isActive: boolean;
  }>({
    positionY: 0,
    positionX: 0,
    backdropHeight: 0,
    backdropWidth: 0,
    isActive: false,
  });
  const { activeChatMembers, activeChatAvatar, activeChatIsGroup } =
    useActiveChat();
  /*   const avatar: IFirebaseRtDbUser['avatar'] = activeChatIsGroup === false ? activeChatAvatar : activeChatMembers?.find((member) => member.uid === messageData.senderUid)?.avatar || USER_AVATAR_DEFAULT_VALUE; */
  const avatar: IFirebaseRtDbUser['avatar'] =
    activeChatIsGroup !== null &&
    activeChatIsGroup === false &&
    activeChatAvatar !== null
      ? activeChatAvatar
      : activeChatMembers?.find(
          (member) => member.uid === messageData.senderUid,
        )?.avatar || USER_AVATAR_DEFAULT_VALUE;
  const username =
    activeChatMembers != null
      ? activeChatMembers.find((member) => member.uid === messageData.senderUid)
          ?.username || USERNAME_LEAVED_VALUE
      : undefined;
  const cancelUploadsForMessage = (messageId: string) => {
    if (uploadTasksRef.current[messageId]) {
      /* Отмена загрузки каждого файла */
      Object.values(uploadTasksRef.current[messageId]).forEach(
        ({ task, fileRef }: IUploadTaskWithRef) => {
          /* отмена загрузки в Firebase storage */
          task.cancel();
          /* Удаление файлов загруженных из Firebase Storage при прерывании загрузки */
          deleteObject(fileRef)
            .then(() => {})
            .catch((error) => {
              console.error('Ошибка при удалении файла: ', error);
            });
        },
      );
      /* Удаление рефов загрузки для данного сообщения */
      delete uploadTasksRef.current[messageId];
    }
  };

  return (
    <>
      <div
        className={styles['message']}
        id={messageData.messageId}
        onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault();
          e.stopPropagation();

          // координаты на странице относительно оверлея
          const backdropElement = document.getElementById(
            'message-context-backdrop',
          ) as HTMLDivElement; // находится в ChatPage
          const { width, left } = backdropElement.getBoundingClientRect();
          setContextMenuActive({
            positionY: e.clientY,
            positionX: e.clientX - left, // координата X относительно backdropElement
            backdropHeight: document.documentElement.scrollHeight, // высота всей страницы
            backdropWidth: width,
            isActive: true,
          });
        }}
      >
        {isLastOfGroup && uid && messageData.senderUid != uid && (
          <AvatarImage AvatarImg={avatar} isLittle={true} />
        )}
        <div
          className={`${styles['message__wrapper']} ${messageData.senderUid === uid ? styles['own'] : ''} ${isLastOfGroup ? `${styles['border']} ${styles['margin-left']}` : ''} ${isFirstOfGroup && messageIndex !== 0 ? styles['margin-top'] : ''}`}
        >
          {/* отображение username в групповом чате */}
          {isFirstOfGroup === true &&
            activeChatIsGroup === true &&
            username !== undefined &&
            messageData.senderUid !== uid && (
              <div
                className={`${styles['message__username-wrapper']} ${messageData.media.length > 0 ? styles['message__username-wrapper--befor-media'] : ''}  ${messageData.media.length === 0 && messageData.files.length > 0 ? styles['message__username-wrapper--before-files'] : ''}`}
              >
                <span className={styles['message__username']}>{username}</span>
              </div>
            )}

          {/* отображение медиа файлов */}
          {messageData.media.length > 0 && (
            <div className={styles['message__album']}>
              {messageData?.media.map((messageItemData, index: number) => {
                const isArrayLengthOdd = messageData.media.length % 2 !== 0;
                /* isArrayLengthOdd = если нечётная длина массива, тогда true */
                const isOdd = index % 2 !== 0;
                /* isOdd если индекс нечётный, то true */
                const isLast = index === messageData.media.length - 1;
                const prevIsHorizontal =
                  index > 0 && messageData.media[index - 1].isHorizontal;
                const prevIsSquare =
                  index > 0 && messageData.media[index - 1].isSquare;
                const nextIsHorizontal =
                  index < messageData.media.length - 1 &&
                  messageData.media[index + 1].isHorizontal;
                const nextIsSquare =
                  index < messageData.media.length - 1 &&
                  messageData.media[index + 1].isSquare;

                /* первыми идут проверки на isSquare, чтобы не писать везде доп проверки на isSquare nextIsSquare prevIsSquare в каждой проверке */

                const width =
                  messageData.media.length === 1
                    ? '100%'
                    : isArrayLengthOdd && isLast
                      ? '100%'
                      : !isOdd &&
                          messageItemData.isSquare &&
                          messageData.media.length > 1 &&
                          nextIsSquare
                        ? '50%'
                        : isOdd &&
                            messageItemData.isSquare &&
                            messageData.media.length > 1 &&
                            prevIsSquare
                          ? '50%'
                          : messageData.media.length > 1 &&
                              !isOdd &&
                              messageItemData.isSquare &&
                              nextIsHorizontal &&
                              !nextIsSquare
                            ? '33.33%'
                            : messageData.media.length > 1 &&
                                isOdd &&
                                messageItemData.isSquare &&
                                prevIsHorizontal &&
                                !prevIsSquare
                              ? '33.33%'
                              : messageData.media.length > 1 &&
                                  !isOdd &&
                                  nextIsSquare &&
                                  messageItemData.isHorizontal &&
                                  !messageItemData.isSquare
                                ? '66.66%'
                                : messageData.media.length > 1 &&
                                    isOdd &&
                                    prevIsSquare &&
                                    messageItemData.isHorizontal &&
                                    !messageItemData.isSquare
                                  ? '66.66%'
                                  : isOdd &&
                                      prevIsHorizontal &&
                                      messageItemData.isHorizontal &&
                                      !isArrayLengthOdd &&
                                      messageData.media.length === 2
                                    ? '100%'
                                    : !isOdd &&
                                        nextIsHorizontal &&
                                        messageItemData.isHorizontal &&
                                        !isArrayLengthOdd &&
                                        messageData.media.length === 2
                                      ? '100%'
                                      : isOdd &&
                                          prevIsHorizontal &&
                                          messageItemData.isHorizontal &&
                                          messageData.media.length > 2
                                        ? '50%'
                                        : !isOdd &&
                                            nextIsHorizontal &&
                                            messageItemData.isHorizontal &&
                                            messageData.media.length > 2
                                          ? '50%'
                                          : messageData.media.length > 1 &&
                                              !isOdd &&
                                              messageItemData.isHorizontal &&
                                              !nextIsHorizontal
                                            ? '66.66%'
                                            : messageData.media.length > 1 &&
                                                isOdd &&
                                                messageItemData.isHorizontal &&
                                                !prevIsHorizontal
                                              ? '66.66%'
                                              : messageData.media.length > 1 &&
                                                  !isOdd &&
                                                  !messageItemData.isHorizontal &&
                                                  nextIsHorizontal
                                                ? '33.33%'
                                                : messageData.media.length >
                                                      1 &&
                                                    isOdd &&
                                                    !messageItemData.isHorizontal &&
                                                    prevIsHorizontal
                                                  ? '33.33%'
                                                  : messageData.media.length >
                                                        1 &&
                                                      isOdd &&
                                                      !messageItemData.isHorizontal &&
                                                      !prevIsHorizontal
                                                    ? '50%'
                                                    : messageData.media.length >
                                                          1 &&
                                                        !isOdd &&
                                                        !messageItemData.isHorizontal &&
                                                        !nextIsHorizontal
                                                      ? '50%'
                                                      : '100%';

                return (
                  <MessageMediaItem
                    key={index}
                    width={width}
                    progress={
                      'progress' in messageItemData
                        ? messageItemData.progress
                        : undefined
                    }
                    imgUrl={
                      'imgUrl' in messageItemData
                        ? messageItemData.imgUrl
                        : undefined
                    }
                    videoUrl={
                      'videoUrl' in messageItemData
                        ? messageItemData.videoUrl
                        : undefined
                    }
                    videoPreview={
                      'videoPreview' in messageItemData
                        ? messageItemData.videoPreview
                        : undefined
                    }
                    progressPreview={
                      'progressPreview' in messageItemData
                        ? messageItemData.progressPreview
                        : undefined
                    }
                    messageData={messageData}
                    index={index}
                    cancelUploads={() =>
                      cancelUploadsForMessage(messageData.messageId)
                    }
                  />
                );
              })}
              {messageData.messageText.length === 0 &&
                messageData.files.length === 0 &&
                messageData.media.length > 0 && (
                  <div className={styles['message__image-info-wrapper']}>
                    <CheckedAndTimeStatuses
                      isCanceled={
                        'isCanceled' in messageData
                          ? messageData.isCanceled
                          : undefined
                      }
                      isLoading={messageData.isLoading}
                      isChecked={messageData.isChecked}
                      time={messageData.messageDateUTC}
                      isForImage={true}
                      isOwn={messageData.senderUid === uid}
                    />
                  </div>
                )}
            </div>
          )}
          {/* отображение файлов */}
          {messageData.files.length > 0 && (
            <div
              className={`${styles['message__files-wrapper']} ${messageData.messageText.length === 0 ? styles['message__files-wrapper--padding-bottom'] : ''}`}
            >
              {messageData.files.map((file, index: number) => (
                <MessageFileItem
                  key={index}
                  fileUrl={file.fileUrl}
                  fileName={file.fileName}
                  fileSize={file.fileSize}
                  progress={'progress' in file ? file.progress : undefined}
                  isStatusesVisible={
                    messageData.messageText.length === 0 &&
                    messageData.files.length - 1 === index
                  }
                  isCheckedStatus={messageData.isChecked}
                  isLoadingStatus={messageData.isLoading}
                  isCanceledStatus={
                    'isCanceled' in messageData
                      ? messageData.isCanceled
                      : undefined
                  }
                  timeStatus={messageData.messageDateUTC}
                  isMessageOwn={messageData.senderUid === uid}
                  cancelUploads={() =>
                    cancelUploadsForMessage(messageData.messageId)
                  }
                />
              ))}
            </div>
          )}
          {/* отображение текста */}
          {messageData.messageText.length > 0 && (
            <div className={styles['message__text-wrapper']}>
              {messageData.messageText.length > 0 && (
                <span
                  className={styles['message__text']}
                  onContextMenu={(
                    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
                  ) => {
                    e.stopPropagation();
                  }}
                >
                  <Linkify options={{ target: '_blank' }}>
                    {messageData.messageText}
                  </Linkify>
                  <div className={styles['message__text-info-wrapper']}>
                    <CheckedAndTimeStatuses
                      isCanceled={
                        'isCanceled' in messageData
                          ? messageData.isCanceled
                          : undefined
                      }
                      isLoading={messageData.isLoading}
                      isChecked={messageData.isChecked}
                      time={messageData.messageDateUTC}
                      isOwn={messageData.senderUid === uid}
                    />
                  </div>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {сontextMenuActive.isActive && (
        <MessageContextBackdrop
          messageText={messageData.messageText}
          setContextMenuActive={setContextMenuActive}
          сontextMenuActive={сontextMenuActive}
        />
      )}
    </>
  );
};

export default Message;
