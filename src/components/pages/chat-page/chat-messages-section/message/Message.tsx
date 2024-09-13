import { FC } from 'react';

import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';

import styles from './Message.module.scss';
import MessageImage from '../message-image/MessageImage';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import Linkify from 'linkify-react';

/* interface MessageProps {} */

const Message: FC = ({ messageData, isLastOfGroup, isFirstOfGroup }) => {
  return (
    <div className={styles['message']}>
      {isLastOfGroup && !messageData.isOwn && (
        <AvatarImage AvatarImg={messageData.userAvatar} isLittle={true} />
      )}
      <div
        className={`${styles['message__wrapper']} ${messageData.isOwn ? styles['own'] : ''} ${isLastOfGroup ? `${styles['border']} ${styles['margin-left']}` : ''} ${isFirstOfGroup ? styles['margin-top'] : ''}`}
      >
        {messageData.media.length > 0 && (
          <div className={styles['message__album']}>
            {messageData?.media.map(
              ({ img, isHorizontal, isSquare }, index: number) => {
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

                /* первыми идут проверки на isSquare, чтобы не писать везде проверку на isSquare nextIsSquare prevIsSquare в каждой проверке */

                const width =
                  messageData.media.length === 1
                    ? '100%'
                    : isArrayLengthOdd && isLast
                      ? '100%'
                      : !isOdd &&
                          isSquare &&
                          messageData.media.length > 1 &&
                          nextIsSquare
                        ? '50%'
                        : isOdd &&
                            isSquare &&
                            messageData.media.length > 1 &&
                            prevIsSquare
                          ? '50%'
                          : messageData.media.length > 1 &&
                              !isOdd &&
                              isSquare &&
                              nextIsHorizontal &&
                              !nextIsSquare
                            ? '33.33%'
                            : messageData.media.length > 1 &&
                                isOdd &&
                                isSquare &&
                                prevIsHorizontal &&
                                !prevIsSquare
                              ? '33.33%'
                              : messageData.media.length > 1 &&
                                  !isOdd &&
                                  nextIsSquare &&
                                  isHorizontal &&
                                  !isSquare
                                ? '66.66%'
                                : messageData.media.length > 1 &&
                                    isOdd &&
                                    prevIsSquare &&
                                    isHorizontal &&
                                    !isSquare
                                  ? '66.66%'
                                  : isOdd &&
                                      prevIsHorizontal &&
                                      isHorizontal &&
                                      !isArrayLengthOdd &&
                                      messageData.media.length === 2
                                    ? '100%'
                                    : !isOdd &&
                                        nextIsHorizontal &&
                                        isHorizontal &&
                                        !isArrayLengthOdd &&
                                        messageData.media.length === 2
                                      ? '100%'
                                      : isOdd &&
                                          prevIsHorizontal &&
                                          isHorizontal &&
                                          messageData.media.length > 2
                                        ? '50%'
                                        : !isOdd &&
                                            nextIsHorizontal &&
                                            isHorizontal &&
                                            messageData.media.length > 2
                                          ? '50%'
                                          : messageData.media.length > 1 &&
                                              !isOdd &&
                                              isHorizontal &&
                                              !nextIsHorizontal
                                            ? '66.66%'
                                            : messageData.media.length > 1 &&
                                                isOdd &&
                                                isHorizontal &&
                                                !prevIsHorizontal
                                              ? '66.66%'
                                              : messageData.media.length > 1 &&
                                                  !isOdd &&
                                                  !isHorizontal &&
                                                  nextIsHorizontal
                                                ? '33.33%'
                                                : messageData.media.length >
                                                      1 &&
                                                    isOdd &&
                                                    !isHorizontal &&
                                                    prevIsHorizontal
                                                  ? '33.33%'
                                                  : messageData.media.length >
                                                        1 &&
                                                      isOdd &&
                                                      !isHorizontal &&
                                                      !prevIsHorizontal
                                                    ? '50%'
                                                    : messageData.media.length >
                                                          1 &&
                                                        !isOdd &&
                                                        !isHorizontal &&
                                                        !nextIsHorizontal
                                                      ? '50%'
                                                      : '100%';

                return (
                  <MessageImage
                    key={index}
                    width={width}
                    img={img}
                    messageData={messageData}
                    index={index}
                  />
                );
              },
            )}
            {messageData.contentText.length === 0 &&
              messageData.media.length > 0 && (
                <div className={styles['message__image-info-wrapper']}>
                  {messageData.isChecked && (
                    <CheckedStatusSvg
                      className={`${styles['message__checked-mark']} ${styles['message__checked-mark--image']}`}
                    />
                  )}
                  {!messageData.isChecked && (
                    <UncheckedStatusSvg
                      className={`${styles['message__unchecked-mark']} ${styles['message__unchecked-mark--image']}`}
                    />
                  )}
                  <span
                    className={`${styles['message__timestamp']} ${styles['message__timestamp--image']}`}
                  >
                    {messageData.messageDate}
                  </span>
                </div>
              )}
          </div>
        )}
        {messageData.contentText && (
          <div className={styles['message__content']}>
            <div className={styles['message__text']}>
              <Linkify options={{ target: '_blank' }}>
                {messageData.contentText}
              </Linkify>
              <div className={styles['message__info-wrapper']}>
                {messageData.isChecked && (
                  <CheckedStatusSvg
                    className={styles['message__checked-mark']}
                  />
                )}
                {!messageData.isChecked && (
                  <UncheckedStatusSvg
                    className={styles['message__unchecked-mark']}
                  />
                )}
                <span className={styles['message__timestamp']}>
                  {messageData.messageDate}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
