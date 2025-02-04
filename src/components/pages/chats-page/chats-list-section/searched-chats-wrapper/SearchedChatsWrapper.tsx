import { FC } from 'react';
import styles from './SearchedChatsWrapper.module.scss';

import { IChatWithDetails } from 'src/interfaces/ChatsWithDetails.interface';

import ChatItem from '../chat-item/ChatItem';

interface SearchedChatsWrapperProps {
  unreadCounts: Record<string, number>;
  searchedChats: IChatWithDetails[];
  chatsListRef: React.RefObject<HTMLDivElement | null>;
  isMobileScreen: boolean;
  uid: string | null;
}
const SearchedChatsWrapper: FC<SearchedChatsWrapperProps> = ({
  unreadCounts,
  searchedChats,
  chatsListRef,
  isMobileScreen,
  uid,
}) => {
  return (
    <div className={styles['searched-chats-wrapper']}>
      <span className={styles['searched-chats-wrapper__text']}>Чаты</span>
      {searchedChats.map((chat, index) => {
        const otherMember =
        chat.isGroup === false &&
          chat.membersDetails.find((member) => member.uid !== uid)!;

        return (
          <ChatItem
            uncheckedCount={unreadCounts[`${chat.chatId}`]}
            key={index}
            uid={uid!}
            chatItemData={chat}
            chatsListRef={chatsListRef}
            isMobileScreen={isMobileScreen}
            chatname={
              otherMember === false
                ? chat.groupChatname
                : otherMember.username
            }
            chatAvatar={
              otherMember === false
                ? chat.groupAvatar
                : otherMember?.avatar
            }
          />
        );
      })}
    </div>
  );
};

export default SearchedChatsWrapper;
