import { FC } from 'react';
import styles from './SearchedChatsWrapper.module.scss';

import { IChatWithDetails } from 'src/interfaces/chatsWithDetails.interface';

import ChatItem from '../chat-item/ChatItem';

interface SearchedChatsWrapperProps {
  searchedChats: IChatWithDetails[];
  chatsListRef: React.RefObject<HTMLDivElement | null>;
  isMobileScreen: boolean;
  uid: string | null;
}
const SearchedChatsWrapper: FC<SearchedChatsWrapperProps> = ({
  searchedChats,
  chatsListRef,
  isMobileScreen,
  uid,
}) => {
  return (
    <div className={styles['searched-chats-wrapper']}>
      <span className={styles['searched-chats-wrapper__text']}>Чаты</span>
      {searchedChats.map((chatItemData, index) => {
        const otherMember =
          chatItemData.groupChatname.length === 0 &&
          chatItemData.membersDetails.length === 2 &&
          chatItemData.membersDetails.find((member) => member.uid !== uid)!;

        return (
          <ChatItem
            key={index}
            chatItemData={chatItemData}
            chatsListRef={chatsListRef}
            isMobileScreen={isMobileScreen}
            chatName={
              otherMember === false
                ? chatItemData.groupChatname
                : otherMember.username
            }
            chatAvatar={
              otherMember === false
                ? chatItemData.groupAvatar
                : otherMember?.avatar
            }
          />
        );
      })}
    </div>
  );
};

export default SearchedChatsWrapper;
