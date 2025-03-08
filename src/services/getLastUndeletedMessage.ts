import { firebaseDatabase } from 'src/firebase';
import { ref, query, orderByChild, equalTo, limitToLast, get } from "firebase/database";
import { IMessage } from "src/interfaces/Message.interface";

const getLastUndeletedMessage = async (chatId: string): Promise<IMessage | null> => {
  const messagesRef = ref(firebaseDatabase, `chats/${chatId}/messages`);
  const messagesQuery = query(
    messagesRef,
    orderByChild("isDeleted"),
    equalTo(false), // Фильтруем неудаленные сообщения
    limitToLast(1)
  );

  const messagesSnapshot = await get(messagesQuery);
  if (messagesSnapshot.exists()) {
    const messages = Object.values(messagesSnapshot.val());
    return messages[0] as IMessage;
  }
  return null;
};

export default getLastUndeletedMessage