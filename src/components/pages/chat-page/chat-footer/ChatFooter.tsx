import { FC, useState } from 'react';

import styles from './ChatFooter.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';
import AttachedContentWrapper from './attached-content-wrapper/AttachedContentWrapper';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import DragNDropZone from './drag-n-drop-zone/DragNDropZone';

interface ChatFooterProps {
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  isDrag: boolean;
  setIsDrag: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatFooter: FC<ChatFooterProps> = ({
  isMobileScreen,
  uploadTasksRef,
  isDrag,
  setIsDrag,
}) => {
  const [attachedItems, setAttachedItems] = useState<AttachedItemType[]>([]);
  const ComponentTag = isMobileScreen ? 'footer' : 'div';

  return (
    <ComponentTag className={styles['chat-footer']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-footer__content']}>
          {attachedItems.length > 0 && (
            <AttachedContentWrapper
              setAttachedItems={setAttachedItems}
              attachedItems={attachedItems}
            />
          )}
          <MessageInputWrapper
            uploadTasksRef={uploadTasksRef}
            attachedItems={attachedItems}
            setAttachedItems={setAttachedItems}
            isMobileScreen={isMobileScreen}
          />
        </div>
      </div>
      {!isMobileScreen && (
        <DragNDropZone
          setAttachedItems={setAttachedItems}
          isDrag={isDrag}
          setIsDrag={setIsDrag}
        />
      )}
    </ComponentTag>
  );
};

export default ChatFooter;
