import { FC, useState } from 'react';
import ArrowCircleSvg from 'src/assets/images/icons/24x24-icons/Left arrow circle.svg?react';

import styles from './MessageInputWrapper.module.scss';
import AttachMenu from '../attach-menu/AttachMenu';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

interface MessageInputWrapperProps {
  isMobileScreen: boolean;
  setAttachedItems: React.Dispatch<React.SetStateAction<AttachedItemType[]>>;
  isAttachedItems: boolean;
}

const MessageInputWrapper: FC<MessageInputWrapperProps> = ({
  isMobileScreen,
  setAttachedItems,
  isAttachedItems,
}) => {
  const [messageContent, setMessageContent] = useState<string>('');

  return (
    <div className={styles['message-input-wrapper']}>
      <AttachMenu
        setAttachedItems={setAttachedItems}
        isAttachedItems={isAttachedItems}
        isMobileScreen={isMobileScreen}
      />
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
    </div>
  );
};

export default MessageInputWrapper;
