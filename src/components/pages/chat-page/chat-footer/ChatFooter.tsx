import { FC, useState } from 'react';

import styles from './ChatFooter.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';
import AttachedContentWrapper from './attached-content-wrapper/AttachedContentWrapper';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

interface ChatFooterProps {
  isMobileScreen: boolean;
}

const ChatFooter: FC<ChatFooterProps> = ({ isMobileScreen }) => {
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
            isAttachedItems={attachedItems.length > 0}
            setAttachedItems={setAttachedItems}
            isMobileScreen={isMobileScreen}
          />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatFooter;
