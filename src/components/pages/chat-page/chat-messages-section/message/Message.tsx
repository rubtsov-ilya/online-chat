import { FC, useState } from 'react';

import styles from './Message.module.scss';
import { firebaseDatabase } from 'src/firebase';
import {
  equalTo,
  get,
  orderByChild,
  query,
  ref as refFirebaseDatabase,
  serverTimestamp,
  update,
} from 'firebase/database';
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
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbUser,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import MessageContextBackdrop from '../message-context-backdrop/MessageContextBackdrop';
import useMobileScreen from 'src/hooks/useMobileScreen';
import useToggleModal from 'src/hooks/useToggleModal';
import ModalBackdrop from 'src/components/ui/modal-backdrop/ModalBackdrop';
import ModalActionConfirm from 'src/components/ui/modal-action-confirm/modalActionConfirm';
import getLastUndeletedMessage from 'src/services/getLastUndeletedMessage';
import { useDispatch } from 'react-redux';
import useSelectedMessages from 'src/hooks/useSelectedMessages';
import {
  addSelectedMessage,
  removeSelectedMessage,
} from 'src/redux/slices/SelectedMessagesSlice';
import EmptyCircleSvg from 'src/assets/images/icons/24x24-icons/Empty cirlce.svg?react';
import CheckCircleSvg from 'src/assets/images/icons/24x24-icons/Check Circle.svg?react';

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
  const {
    activeChatMembers,
    activeChatAvatar,
    activeChatIsGroup,
    activeChatId,
  } = useActiveChat();

  const [modalOpen, setModalOpen] = useState<'delete' | false>(false);
  const dispatch = useDispatch();
  const { isMobileScreen } = useMobileScreen();
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const { isMessagesSelecting, selectedMessages } = useSelectedMessages();

  const isMessageSelected = selectedMessages.find(
    (message) => message.messageId === messageData.messageId,
  );

  const modalDuration = 100;

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

  const modalActionData = {
    delete: {
      title: 'Удалить сообщение',
      subtitle: 'Вы хотите удалить сообщение безвозвратно?',
      actionBtnText: 'Удалить',
      action: async () => {
        try {
          if (activeChatMembers === null || activeChatId === null) {
            return;
          }

          /* const chatRef = refFirebaseDatabase(
            firebaseDatabase,
            `chats/${activeChatId}`,
          ); */

          const lastMessageDateUTCRef = refFirebaseDatabase(
            firebaseDatabase,
            `userChats/${uid}/chats/${activeChatId}/lastMessageDateUTC`,
          );

          /* const chatSnapshot = await get(chatRef); */
          const lastMessageDateUTCSnapshot = await get(lastMessageDateUTCRef);

          if (!lastMessageDateUTCSnapshot.exists()) {
            throw new Error('Чат не найден');
          }

          /* const chatValue = chatSnapshot.val() as IFirebaseRtDbChatsChat; */
          const lastMessageDateUTCValue =
            lastMessageDateUTCSnapshot.val() as IFirebaseRtDbChat['lastMessageDateUTC'];

          // обновляем сообщение как удаленное
          await update(refFirebaseDatabase(firebaseDatabase), {
            [`chats/${activeChatId}/messages/${messageData.messageId}/isDeleted`]:
              true,
          });

          // получаем последнее неудаленное сообщение в чате, значение в удалемом уже будет обновлено
          const lastUndeletedMessage =
            await getLastUndeletedMessage(activeChatId);

          if (lastUndeletedMessage === null && activeChatIsGroup === false) {
            // lastUndeletedMessage === null в случае, если нет неудаленных сообщений
            // тогда нужно указать, что история очищена

            const membersIds = activeChatMembers.map((member) => member.uid);

            const updatesByUnreadMessages = {
              [`chats/${activeChatId}/unreadMessages`]: null,
            };

            const newChatsData = {
              lastMessageText: 'История очищена',
              lastMessageDateUTC: serverTimestamp(),
              lastMessageIsChecked: null,
              lastMessageSenderUid: uid!,
            };

            const updatesByUserChats = membersIds.reduce(
              (acc, memberUid) => {
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageDateUTC`
                ] = newChatsData.lastMessageDateUTC;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageIsChecked`
                ] = newChatsData.lastMessageIsChecked;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageSenderUid`
                ] = newChatsData.lastMessageSenderUid;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageText`
                ] = newChatsData.lastMessageText;
                return acc;
              },
              {} as Record<string, any>,
            );

            const updatesByChatClearing = {
              ...updatesByUserChats,
              ...updatesByUnreadMessages,
            };

            await update(
              refFirebaseDatabase(firebaseDatabase),
              updatesByChatClearing,
            );

            return;
          }

          // проверяем, является ли последнее неудаленное сообщение тем, что на данный момент установлено в usersChats/uid/chats/chatId
          const isLastUndeletedMessageDifferent =
            lastUndeletedMessage?.messageDateUTC !== lastMessageDateUTCValue; // выдаст true если сообщения отличаются, тогда нужно обновлять значения в usersChats/uid/chats/chatId всем участникам

          if (
            isLastUndeletedMessageDifferent &&
            lastUndeletedMessage !== null
          ) {
            // если последнее сообщение не то, что сейчас установлено, обновляем userChats для всех участников
            const membersIds = activeChatMembers.map((member) => member.uid);

            const updatesByUnreadMessages = membersIds.reduce(
              (acc, memberId) => {
                acc[
                  `chats/${activeChatId}/unreadMessages/${memberId}/${messageData.messageId}`
                ] = null;

                return acc;
              },
              {} as Record<string, any>,
            );

            const updatesByUserChats = membersIds.reduce(
              (acc, memberUid) => {
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageDateUTC`
                ] = lastUndeletedMessage.messageDateUTC;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageIsChecked`
                ] = lastUndeletedMessage.isChecked;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageSenderUid`
                ] = lastUndeletedMessage.senderUid;
                acc[
                  `userChats/${memberUid}/chats/${activeChatId}/lastMessageText`
                ] = lastUndeletedMessage.messageText;
                return acc;
              },
              {} as Record<string, any>,
            );

            const updatesByChat = {
              ...updatesByUserChats,
              ...updatesByUnreadMessages,
            };

            await update(refFirebaseDatabase(firebaseDatabase), updatesByChat);
          }
        } catch (error) {
          console.error('Ошибка удаления сообщения:', error);
          throw error;
        }
      },
    },
  };

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

  const onMessageContextMenuClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMessagesSelecting) {
      // если идёт выбор сообщений, контекстное меню недоступно
      return;
    }

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
  };

  const onMessageClick = () => {
    if (!isMessagesSelecting || activeChatId === null) {
      return;
    }

    if (!isMessageSelected) {
      // выбрать сообщение
      const messageDateTimestamp = new Date(
        messageData.messageDateUTC as string,
      ).getTime(); // messageData.messageDateUTC в виде строки
      dispatch(
        addSelectedMessage({
          selectedMessage: {
            messageId: messageData.messageId,
            messageDateUTC: messageDateTimestamp,
          },
          selectedChatId: activeChatId,
        }),
      );
    } else {
      // убрать сообщение из выбранных
      const messageDateTimestamp = new Date(
        messageData.messageDateUTC as string,
      ).getTime(); // messageData.messageDateUTC в виде строки
      dispatch(
        removeSelectedMessage({
          selectedMessage: {
            messageId: messageData.messageId,
            messageDateUTC: messageDateTimestamp,
          },
        }),
      );
    }
  };

  return (
    <>
      <div
        className={`${styles['message']} ${isMessagesSelecting ? styles['selecting'] : ''}`}
        id={messageData.messageId}
        onContextMenu={onMessageContextMenuClick}
        onClick={onMessageClick}
      >
        <div
          className={`${styles['message__selecting-icon-wrapper']} ${isMessagesSelecting ? styles['selecting'] : ''}`}
        >
          <EmptyCircleSvg className={styles['message__selecting-icon']} />
          <CheckCircleSvg
            className={`${styles['message__selected-icon']} ${isMessageSelected ? styles['selected'] : ''}`}
          />
        </div>

        {isLastOfGroup && uid && messageData.senderUid != uid && (
          <AvatarImage AvatarImg={avatar} isLittle={true} />
        )}
        <div
          className={`${styles['message__wrapper']} ${messageData.senderUid === uid ? styles['own'] : ''} ${isLastOfGroup ? `${styles['border']} ${styles['margin-left']}` : ''} ${isFirstOfGroup && messageIndex !== 0 ? styles['margin-top'] : ''} ${isMessageSelected ? styles['selected'] : ''}`}
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
                    if (!isMobileScreen) {
                      e.preventDefault();
                    }
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
          selectingMessageData={{
            messageId: messageData.messageId,
            messageDateUTC: messageData.messageDateUTC as number,
          }}
          setModalOpen={(c) => setModalOpen(c)}
          messageText={messageData.messageText}
          setContextMenuActive={setContextMenuActive}
          сontextMenuActive={сontextMenuActive}
        />
      )}
      {modalOpen && (
        <ModalBackdrop
          transitionDuration={modalDuration}
          toggleModal={() => toggleModal(false, modalDuration)}
          divIdFromIndexHtml={'modal-backdrop'}
        >
          <ModalActionConfirm
            isMobileScreen={isMobileScreen}
            title={modalActionData[modalOpen].title}
            subtitle={modalActionData[modalOpen].subtitle}
            actionBtnText={modalActionData[modalOpen].actionBtnText}
            action={modalActionData[modalOpen].action}
          />
        </ModalBackdrop>
      )}
    </>
  );
};

export default Message;
