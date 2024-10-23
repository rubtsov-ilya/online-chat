import { FC } from 'react';

import styles from './Message.module.scss';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import Linkify from 'linkify-react';
import MessageMediaItem from '../message-media-item/MessageMediaItem';
import MessageFileItem from '../message-file-item/MessageFileItem';
import CheckedAndTimeStatuses from 'src/components/ui/checked-and-time-statuses/CheckedAndTimeStatuses';
import { IMessage } from 'src/interfaces/Message.interface';
import useAuth from 'src/hooks/useAuth';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';

interface MessageProps {
  messageData: IMessage | ILoadingMessage;
  isLastOfGroup: boolean;
  isFirstOfGroup: boolean;
}

const Message: FC<MessageProps> = ({
  messageData,
  isLastOfGroup,
  isFirstOfGroup,
}) => {
  const { uid } = useAuth();

  return (
    <div className={styles['message']} id={messageData.messageId}>
      {isLastOfGroup && uid && messageData.senderUid != uid && (
        <AvatarImage AvatarImg={messageData.userAvatar} isLittle={true} />
      )}
      <div
        className={`${styles['message__wrapper']} ${messageData.senderUid === uid ? styles['own'] : ''} ${isLastOfGroup ? `${styles['border']} ${styles['margin-left']}` : ''} ${isFirstOfGroup ? styles['margin-top'] : ''}`}
      >
        {messageData.media.length > 0 && (
          <div className={styles['message__album']}>
            {messageData?.media.map(
              /* ({ imgUrl, videoUrl, isHorizontal, isSquare }, index: number) => { */
              (messageItemData, index: number) => {
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
                    messageData={messageData}
                    index={index}
                  />
                );
              },
            )}
            {messageData.messageText.length === 0 &&
              messageData.files.length === 0 &&
              messageData.media.length > 0 && (
                <div className={styles['message__image-info-wrapper']}>
                  <CheckedAndTimeStatuses
                    isChecked={messageData.isChecked}
                    time={messageData.messageDateUTC}
                    isForImage={true}
                    isOwn={messageData.senderUid === uid}
                  />
                </div>
              )}
          </div>
        )}
        {messageData.files.length > 0 && (
          <div
            className={`${styles['message__files-wrapper']} ${messageData.messageText.length === 0 ? styles['message__files-wrapper--padding-bottom'] : ''}`}
          >
            {messageData.files.map((file, index: number) => (
              <MessageFileItem
                key={index}
                fileUrl={file.fileUrl}
                fileName={file.fileName}
                isStatusesVisible={
                  messageData.messageText.length === 0 &&
                  messageData.files.length - 1 === index
                }
                isCheckedStatus={messageData.isChecked}
                timeStatus={messageData.messageDateUTC}
                isMessageOwn={messageData.senderUid === uid}
              />
            ))}
          </div>
        )}
        {messageData.messageText.length > 0 && (
          <div className={styles['message__text-wrapper']}>
            {messageData.messageText.length > 0 && (
              <div className={styles['message__text']}>
                <Linkify options={{ target: '_blank' }}>
                  {messageData.messageText}
                </Linkify>
                <div className={styles['message__text-info-wrapper']}>
                  <CheckedAndTimeStatuses
                    isChecked={messageData.isChecked}
                    time={messageData.messageDateUTC}
                    isOwn={messageData.senderUid === uid}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
