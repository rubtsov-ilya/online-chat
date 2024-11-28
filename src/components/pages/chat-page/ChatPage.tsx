import { FC, useRef, useState } from 'react';
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
  const [isDrag, setIsDrag] = useState<boolean>(false);

  const onDragEnter = (event: React.DragEvent) => {
    if (!isMobileScreen) {
      event.preventDefault();
      setIsDrag(true);
    }
  };

  const devUserData = {
    uid: 'yp7vuU1DFuRnGlwa5m7IGUtV7GJ6',
    avatar:
      'https://img.freepik.com/free-photo/futuristic-cat-with-goggles_23-2150969291.jpg?t=st=1723732192~exp=1723735792~hmac=a4a2681fc1de61379eaa4e0c3fa697ded740bab5de9171e7678b25df7276ff80&w=826',
    email: 'anton@gmail.com',
    blocked: [],
  };

  return (
    <ComponentTag onDragEnter={onDragEnter} className={styles['main']}>
      <ChatHeader isMobileScreen={isMobileScreen} avatar={devUserData.avatar} />
      <ChatMessagesSection
        uploadTasksRef={uploadTasksRef}
        isMobileScreen={isMobileScreen}
        avatar={devUserData.avatar}
      />
      <ChatFooter
        isDrag={isDrag}
        setIsDrag={setIsDrag}
        uploadTasksRef={uploadTasksRef}
        isMobileScreen={isMobileScreen}
      />
    </ComponentTag>
  );
};

export default ChatPage;
