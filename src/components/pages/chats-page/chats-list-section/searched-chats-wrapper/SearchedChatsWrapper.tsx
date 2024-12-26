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
      {searchedChats.map((chat, index) => {
        const otherMember =
        chat.groupChatname.length === 0 &&
          chat.membersDetails.length === 2 &&
          chat.membersDetails.find((member) => member.uid !== uid)!;

        return (
          <ChatItem
            key={index}
            chatItemData={chat}
            chatsListRef={chatsListRef}
            isMobileScreen={isMobileScreen}
            chatName={
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
