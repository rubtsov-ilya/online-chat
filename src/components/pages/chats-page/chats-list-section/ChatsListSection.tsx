import { FC } from 'react';
import Search from 'src/components/ui/search/Search';

import styles from './ChatsListSection.module.scss';
import EmptyChatsWrapper from './empty-chats-wrapper/EmptyChatsWrapper';
import ChatItem from './chat-item/ChatItem';

interface ChatsListSectionProps {
  isMobileScreen: boolean;
}

const ChatsListSection: FC<ChatsListSectionProps> = ({ isMobileScreen }) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  const chatsData: any[] = [{}];

  return (
    <ComponentTag className={styles['chats-list']}>
      <div className={'container container--height container--no-padding'}>
        <div className={styles['chats-list__content']}>
          {chatsData?.length === 0 && <EmptyChatsWrapper />}

          {chatsData?.length !== 0 && (
            <>
              <div className={styles['chats-list__search-wrapper']}>
                <Search />
              </div>
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
              <ChatItem isMobileScreen={isMobileScreen} />
            </>
          )}
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatsListSection;
