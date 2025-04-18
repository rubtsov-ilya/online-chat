import { FC, useEffect } from 'react';
import ChatsTopSection from 'src/components/pages/chats-page/chats-top-section/ChatsTopSection';
import ChatsListSection from 'src/components/pages/chats-page/chats-list-section/ChatsListSection';
import { Outlet, useLocation } from 'react-router-dom';

import styles from './ChatsPage.module.scss';
import ChatsDefaultSection from './chats-default-section/ChatsDefaultSection';
import { useDispatch } from 'react-redux';
import { removeActiveChat } from 'src/redux/slices/ActiveChatSlice';
import useSelectedMessages from 'src/hooks/useSelectedMessages';
import { clearSelectedMessagesState } from 'src/redux/slices/SelectedMessagesSlice';
import { clearMessages } from 'src/redux/slices/MessagesArraySlice';

interface ChatsPageProps {
  isMobileScreen: boolean;
}

const ChatsPage: FC<ChatsPageProps> = ({ isMobileScreen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isMessagesForwarding } = useSelectedMessages();

  const isChatPathName = location.pathname === '/chats/chat';

  useEffect(() => {
    if (location.pathname === '/chats') {
      dispatch(removeActiveChat());
      dispatch(clearMessages());
      if (!isMessagesForwarding) {
        dispatch(clearSelectedMessagesState());
      }
    }
  }, [location]);

  return (
    <main className={styles['main']}>
      {!isMobileScreen && (
        <>
          <section className={styles['chats-section']}>
            <ChatsTopSection isMobileScreen={isMobileScreen} />
            <ChatsListSection isMobileScreen={isMobileScreen} />
          </section>
          {isChatPathName && <Outlet />}
          {!isChatPathName && <ChatsDefaultSection />}
        </>
      )}

      {isMobileScreen && (
        <>
          <ChatsTopSection isMobileScreen={isMobileScreen} />
          <ChatsListSection isMobileScreen={isMobileScreen} />
        </>
      )}
    </main>
  );
};

export default ChatsPage;
