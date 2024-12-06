import { FC } from 'react';
import ChatsHeader from 'src/components/pages/chats-page/chats-header/ChatsHeader';
import ChatsListSection from 'src/components/pages/chats-page/chats-list-section/ChatsListSection';
import { Outlet, useLocation } from 'react-router-dom';

import styles from './ChatsPage.module.scss';
import ChatsDefaultSection from './chats-default-section/ChatsDefaultSection';

interface ChatsPageProps {
  isMobileScreen: boolean;
}

const ChatsPage: FC<ChatsPageProps> = ({ isMobileScreen }) => {
  const location = useLocation();
  const isChatPathName = location.pathname === '/chats/chat';

  return (
    <main className={styles['main']}>
      {!isMobileScreen && (
        <>
          <section className={styles['chats-section']}>
            <ChatsHeader isMobileScreen={isMobileScreen} />
            <ChatsListSection isMobileScreen={isMobileScreen} />
          </section>
          {isChatPathName && <Outlet />}
          {!isChatPathName && <ChatsDefaultSection />}
        </>
      )}

      {isMobileScreen && (
        <>
          <ChatsHeader isMobileScreen={isMobileScreen} />
          <ChatsListSection isMobileScreen={isMobileScreen} />
        </>
      )}
    </main>
  );
};

export default ChatsPage;
