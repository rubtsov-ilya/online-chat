import { FC } from 'react';
import styles from './SearchedChatsWrapper.module.scss';
import { IChatsWithImageAndName } from 'src/interfaces/chatsWithImageAndName.interface';
import ChatItem from '../chat-item/ChatItem';

interface SearchedChatsWrapperProps {
  searchedChats: IChatsWithImageAndName[];
  chatsListRef: React.RefObject<HTMLDivElement | null>;
  isMobileScreen: boolean;
}
const SearchedChatsWrapper: FC<SearchedChatsWrapperProps> = ({
  searchedChats,
  chatsListRef,
  isMobileScreen,
}) => {
  return (
    <div className={styles['searched-chats-wrapper']}>
      <span className={styles['searched-chats-wrapper__text']}>Чаты</span>
      {searchedChats.map((chatItemData, index) => {
        return (
          <ChatItem
            key={index}
            chatItemData={chatItemData}
            chatsListRef={chatsListRef}
            isMobileScreen={isMobileScreen}
            chatName={
              chatItemData.groupChatName.length > 0
                ? chatItemData.groupChatName
                : chatItemData.username
            }
            chatAvatar={
              chatItemData.groupChatName.length > 0
                ? chatItemData.groupAvatar
                : chatItemData.userAvatar
            }
          />
        );
      })}
    </div>
  );
};

export default SearchedChatsWrapper;
