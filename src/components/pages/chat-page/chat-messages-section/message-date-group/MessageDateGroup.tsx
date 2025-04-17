import { FC } from 'react';

import { IMessage } from 'src/interfaces/Message.interface';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import MessageStickyDate from '../message-sticky-date/MessageStickyDate';
import Message from '../message/Message';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';

interface MessageDateGroupProps {
  messagesArray: (IMessage | ILoadingMessage)[];
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  uid: string;
  chatMessagesRef: React.RefObject<HTMLDivElement | null>;
}

const MessageDateGroup: FC<MessageDateGroupProps> = ({
  messagesArray,
  uid,
  uploadTasksRef,
  chatMessagesRef,
}) => {

  const undeletedMessagesArray = messagesArray.filter((message) => message.isDeleted !== true);
  const undeletedMessagesMap = new Map();
  undeletedMessagesArray.forEach((message, index) => {
    undeletedMessagesMap.set(message, index);
  });

  return (
    <div>
      <MessageStickyDate
        messageData={messagesArray[0]}
        chatMessagesRef={chatMessagesRef}
      />
      {messagesArray.length > 0 &&
        messagesArray.map((messageData, index) => {
          if (messageData.isDeleted === true) {
            return null
          }

          const undeletedIndex = undeletedMessagesMap.get(messageData);

          return (
            <Message
              key={index}
              uid={uid}
              uploadTasksRef={uploadTasksRef}
              messageData={messageData}
              messageIndex={index}
              isLastOfGroup={
                undeletedIndex === undeletedMessagesArray.length - 1 ||
                messageData.senderUid !== undeletedMessagesArray[undeletedIndex + 1]?.senderUid
              }
              isFirstOfGroup={
                undeletedIndex === 0 ||
                messageData.senderUid !== undeletedMessagesArray[undeletedIndex - 1]?.senderUid
              }
            />
          );
        })}
    </div>
  );
};

export default MessageDateGroup;
