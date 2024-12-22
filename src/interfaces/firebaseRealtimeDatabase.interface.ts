import { IMessage } from "./Message.interface";

export interface IFirebaseRtDbUser {
  uid: string;
  email: string;
  username: string;
  blocked?: string[];
}

export interface IFirebaseRtDbUserSnapshot {
  [uid: string]: string;
}

export interface IFirebaseRtDbUserAvatarSnapshot {
  [uid: string]: string;
}

export interface IFirebaseRtDbChat {
  chatId: string;
  membersIds: string[]; 
  lastMessageText: string; 
  lastMessageDateUTC: string; 
  uncheckedCounter: number; 
  groupChatName: string;
  groupAvatar: string;
  isDeleted: boolean;
}

export interface IFirebaseRtDbUserChat {
  uid: string;
  chats: { [chatId: string]: IFirebaseRtDbChat };
}

export interface IFirebaseRtDbUserChatsSnapshot {
  [chatId: string]: IFirebaseRtDbUserChat; 
}


export interface IFirebaseRtDbChatsChat {
  chatId: string;
  messages: { [messageId: string]: IMessage }; // Сообщения в чате, где ключ - messageId, а значение - объект IMessage
}

export interface IFirebaseRtDbChatsSnapshot {
  [chatId: string]: IFirebaseRtDbChatsChat; // Объект, где ключ - chatId, а значение - объект чата
}