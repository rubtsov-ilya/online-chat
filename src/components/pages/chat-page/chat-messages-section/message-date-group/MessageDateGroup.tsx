import { FC } from 'react';

import { IMessage } from 'src/interfaces/Message.interface';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import MessageStickyDate from '../message-sticky-date/MessageStickyDate';
import Message from '../message/Message';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';

interface MessageDateGroupProps {
  messagesArray: (IMessage | ILoadingMessage)[];
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  uid: string | null;
  chatMessagesRef: React.RefObject<HTMLDivElement | null>;
  avatar: string;
}

const MessageDateGroup: FC<MessageDateGroupProps> = ({
  messagesArray,
  uid,
  uploadTasksRef,
  chatMessagesRef,
  avatar,
}) => {
  // Предполагаем, что messageData и prevMessageData приходят извне, если нужно их использовать
  return (
    <div>
      <MessageStickyDate
        messageData={messagesArray[0]}
        chatMessagesRef={chatMessagesRef}
      />
      {messagesArray.length > 0 &&
        messagesArray.map((messageData, index) => {
          return (
            <Message
              key={index}
              uid={uid}
              avatar={avatar}
              uploadTasksRef={uploadTasksRef}
              messageData={messageData}
              messageIndex={index}
              isLastOfGroup={
                index === messagesArray.length - 1 ||
                messageData.senderUid !== messagesArray[index + 1]?.senderUid
              }
              isFirstOfGroup={
                index === 0 ||
                messageData.senderUid !== messagesArray[index - 1]?.senderUid
              }
            />
          );
        })}
    </div>
  );
};

export default MessageDateGroup;
