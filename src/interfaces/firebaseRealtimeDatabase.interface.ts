import { IMessage } from "./Message.interface";

export interface IFirebaseRtDbUser {
  uid: string;
  email: string;
  username: string;
  blocked?: string[];
}

export interface IFirebaseRtDbUserByName {
  [username: string]: string;
}

export interface IFirebaseRtDbUserAvatar {
  [uid: string]: string;
}

export interface IFirebaseRtDbChat {
  chatId: string;
  membersIds: string[]; 
  lastMessageText: string; 
  lastMessageDateUTC: string; 
  uncheckedCounter: number; 
  groupAvatar: string;
  isDeleted: boolean;
}

export interface IFirebaseRtDbUserChat {
  uid: string;
  chats: { [chatId: string]: IFirebaseRtDbChat };
}

/* export interface IFirebaseRtDbUserChats {
  [uid: string]: IFirebaseRtDbUserChat; 
}
 */

export interface IFirebaseRtDbUserChatChats {
  [chatId: string]: IFirebaseRtDbUserChat; 
}


export interface IFirebaseRtDbChatsChat {
  chatId: string;
  messages: { [messageId: string]: IMessage }; // Сообщения в чате, где ключ - messageId, а значение - объект IMessage
}

/* export interface IFirebaseRtDbChats {
  [chatId: string]: IFirebaseRtDbChatsChat; // Объект, где ключ - chatId, а значение - объект чата
} */