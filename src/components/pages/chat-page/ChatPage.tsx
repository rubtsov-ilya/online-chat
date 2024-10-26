import { FC, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import styles from './ChatPage.module.scss';
import ChatFooter from './chat-footer/ChatFooter';
import ChatHeader from './chat-header/ChatHeader';
import ChatMessagesSection from './chat-messages-section/ChatMessagesSection';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';

const ChatPage: FC = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)' });
  const ComponentTag = isMobileScreen ? 'main' : 'section';
  const uploadTasksRef = useRef<IUploadTasksRef>({});

  return (
    <ComponentTag className={styles['main']}>
      <ChatHeader isMobileScreen={isMobileScreen} />
      <ChatMessagesSection
        uploadTasksRef={uploadTasksRef}
        isMobileScreen={isMobileScreen}
      />
      <ChatFooter
        uploadTasksRef={uploadTasksRef}
        isMobileScreen={isMobileScreen}
      />
    </ComponentTag>
  );
};

export default ChatPage;
