import { FC } from 'react';

import styles from './ChatFooter.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';

interface ChatFooterProps {
  isMobileScreen: boolean;
}

const ChatFooter: FC<ChatFooterProps> = ({ isMobileScreen }) => {
  const ComponentTag = isMobileScreen ? 'footer' : 'div';
  return (
    <ComponentTag className={styles['bottom-bar']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['bottom-bar__content']}>
          <MessageInputWrapper isMobileScreen={isMobileScreen} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatFooter;
