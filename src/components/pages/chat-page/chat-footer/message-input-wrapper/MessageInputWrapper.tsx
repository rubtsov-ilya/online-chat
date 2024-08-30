import { FC, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';
import AttachSvg from 'src/assets/images/icons/24x24-icons/Attach.svg?react';

import styles from './MessageInputWrapper.module.scss';

const MessageInputWrapper: FC = () => {
  const [messageContent, setMessageContent] = useState<string>('');

  return (
    <>
      <button className={styles['message-input-wrapper__btn']}>
        <AttachSvg className={styles['message-input-wrapper__attach-svg']} />
      </button>
      <input
        type="text"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessageContent(e.target.value)
        }
        placeholder="Напишите сообщение..."
        className={styles['message-input-wrapper__input']}
      />
      <button
        disabled={messageContent.length === 0}
        className={styles['message-input-wrapper__btn']}
      >
        <ArrowCircleSvg
          className={
            !messageContent
              ? styles['message-input-wrapper__arrow-svg']
              : `${styles['message-input-wrapper__arrow-svg']} ${styles['active']}`
          }
        />
      </button>
    </>
  );
};

export default MessageInputWrapper;
