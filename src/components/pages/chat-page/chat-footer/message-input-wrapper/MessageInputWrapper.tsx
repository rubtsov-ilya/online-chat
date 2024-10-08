import { FC, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-btn/AttachMenu';

interface MessageInputWrapperProps {
  isMobileScreen: boolean;
}

const MessageInputWrapper: FC<MessageInputWrapperProps> = ({
  isMobileScreen,
}) => {
  const [messageContent, setMessageContent] = useState<string>('');

  return (
    <>
      <AttachMenu isMobileScreen={isMobileScreen} />
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
              ? styles['message-input-wrapper__arrow-icon']
              : `${styles['message-input-wrapper__arrow-icon']} ${styles['active']}`
          }
        />
      </button>
    </>
  );
};

export default MessageInputWrapper;
