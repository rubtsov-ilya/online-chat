import { FC } from 'react';

import styles from './ChatFooter.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';
import ToBottomBtn from 'src/components/ui/to-bottom-btn/ToBottomBtn';

interface ChatFooterProps {
  isMobileScreen: boolean;
}

const ChatFooter: FC<ChatFooterProps> = ({ isMobileScreen }) => {
  const ComponentTag = isMobileScreen ? 'footer' : 'div';
  return (
    <ComponentTag className={styles['chat-footer']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-footer__content']}>
          <MessageInputWrapper isMobileScreen={isMobileScreen} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatFooter;
