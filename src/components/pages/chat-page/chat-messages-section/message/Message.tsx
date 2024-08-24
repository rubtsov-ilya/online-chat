import { FC, useLayoutEffect, useState } from 'react';

import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';

import styles from './Message.module.scss';
import MessageImage from '../message-image/MessageImage';

const Message: FC = ({ messageData, isLastOfGroup, isFirstOfGroup }) => {
  const [imageData, setImageData] = useState<
    { img: string; isHorizontal: boolean; isSquare: boolean }[]
  >([]);

  useLayoutEffect(() => {
    Promise.all(
      messageData.images.map(async (img) => {
        const image = new Image();
        image.src = img;
        await new Promise((resolve) => {
          image.onload = resolve;
        });
        return {
          img,
          isHorizontal:
            image.width > image.height || image.width === image.height,
          isSquare: image.width === image.height,
        };
      }),
    ).then((imageData) => {
      if (imageData.length > 0) {
        setImageData(imageData);
      }
    });
  }, [messageData.images]);

  return (
    <div
      className={`${styles['message']} ${messageData?.isOwn ? styles['own'] : ''} ${isLastOfGroup ? styles['border'] : ''} ${isFirstOfGroup ? styles['margin-top'] : ''}`}
    >
      {messageData.images.length > 0 && (
        <div className={styles['message__album']}>
          {imageData?.map(({ img, isHorizontal, isSquare }, index: number) => {
            const isArrayLengthOdd = imageData.length % 2 !== 0;
            /* isArrayLengthOdd = если нечётная длина массива, тогда true */
            const isOdd = index % 2 !== 0;
            /* isOdd если индекс нечётный, то true */
            const isLast = index === imageData.length - 1;
            const prevIsHorizontal =
              index > 0 && imageData[index - 1].isHorizontal;
            const prevIsSquare = index > 0 && imageData[index - 1].isSquare;
            const nextIsHorizontal =
              index < imageData.length - 1 && imageData[index + 1].isHorizontal;
            const nextIsSquare =
              index < imageData.length - 1 && imageData[index + 1].isSquare;

            /* первыми идут проверки на isSquare, чтобы не писать везде проверку на isSquare nextIsSquare prevIsSquare в каждой проверке */

            const width =
              imageData.length === 1
                ? '100%'
                : isArrayLengthOdd && isLast
                  ? '100%'
                  : !isOdd && isSquare && imageData.length > 1 && nextIsSquare
                    ? '50%'
                    : isOdd && isSquare && imageData.length > 1 && prevIsSquare
                      ? '50%'
                      : imageData.length > 1 &&
                          !isOdd &&
                          isSquare &&
                          nextIsHorizontal &&
                          !nextIsSquare
                        ? '33.33%'
                        : imageData.length > 1 &&
                            isOdd &&
                            isSquare &&
                            prevIsHorizontal &&
                            !prevIsSquare
                          ? '33.33%'
                          : imageData.length > 1 &&
                              !isOdd &&
                              nextIsSquare &&
                              isHorizontal &&
                              !isSquare
                            ? '66.66%'
                            : imageData.length > 1 &&
                                isOdd &&
                                prevIsSquare &&
                                isHorizontal &&
                                !isSquare
                              ? '66.66%'
                              : isOdd &&
                                  prevIsHorizontal &&
                                  isHorizontal &&
                                  !isArrayLengthOdd &&
                                  imageData.length === 2
                                ? '100%'
                                : !isOdd &&
                                    nextIsHorizontal &&
                                    isHorizontal &&
                                    !isArrayLengthOdd &&
                                    imageData.length === 2
                                  ? '100%'
                                  : isOdd &&
                                      prevIsHorizontal &&
                                      isHorizontal &&
                                      imageData.length > 2
                                    ? '50%'
                                    : !isOdd &&
                                        nextIsHorizontal &&
                                        isHorizontal &&
                                        imageData.length > 2
                                      ? '50%'
                                      : imageData.length > 1 &&
                                          !isOdd &&
                                          isHorizontal &&
                                          !nextIsHorizontal
                                        ? '66.66%'
                                        : imageData.length > 1 &&
                                            isOdd &&
                                            isHorizontal &&
                                            !prevIsHorizontal
                                          ? '66.66%'
                                          : imageData.length > 1 &&
                                              !isOdd &&
                                              !isHorizontal &&
                                              nextIsHorizontal
                                            ? '33.33%'
                                            : imageData.length > 1 &&
                                                isOdd &&
                                                !isHorizontal &&
                                                prevIsHorizontal
                                              ? '33.33%'
                                              : imageData.length > 1 &&
                                                  isOdd &&
                                                  !isHorizontal &&
                                                  !prevIsHorizontal
                                                ? '50%'
                                                : imageData.length > 1 &&
                                                    !isOdd &&
                                                    !isHorizontal &&
                                                    !nextIsHorizontal
                                                  ? '50%'
                                                  : '100%';

            return <MessageImage key={index} width={width} img={img} />;
          })}
          {messageData.contentText.length === 0 &&
            messageData.images.length > 0 && (
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
            {messageData.contentText}
            <div className={styles['message__info-wrapper']}>
              {messageData.isChecked && (
                <CheckedStatusSvg className={styles['message__checked-mark']} />
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
  );
};

export default Message;
