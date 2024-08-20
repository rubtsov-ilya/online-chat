import { FC } from 'react';

import CheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check all.svg?react';
import UncheckedStatusSvg from 'src/assets/images/icons/16x16-icons/Check.svg?react';

import styles from './Message.module.scss';

const Message: FC = ({ messageData, isLast, isFirst }) => {
  return (
    <div
      className={`${styles['message']} ${messageData?.isOwn ? styles['own'] : null} ${isLast ? styles['border'] : null} ${isFirst ? styles['margin-top'] : null}`}
    >
      {messageData.images.length > 0 && (
        <div className={styles['message__album']}>
          {messageData.images.map((img, index) => {
            const isOdd = messageData.images.length % 2 !== 0;
            /* isOdd если нечётное, тогда true */
            const isLast = index === messageData.images.length - 1;
            const width = isOdd && isLast ? '100%' : '50%';
            return (
              <div
                key={index}
                style={{ width }}
                className={styles['message__img-wrapper']}
              >
                <img src={img} alt="" className={styles['message__img']} />
              </div>
            );
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
