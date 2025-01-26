import { IMessage } from "./Message.interface";

export interface IFirebaseRtDbUser {
  uid: string;
  email: string;
  avatar: string;
  username: string;
  usernameNormalized: string;
  isOnline: boolean;
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
  lastMessageDateUTC: number | object; 
  lastMessageIsChecked: boolean;
  lastMessageSenderUid: string; 
  groupChatname: string;
  groupAvatar: string;
  groupAdminUid: string;
  isGroup: boolean;
}

/* unreadMessages: {
  [uid: string] : {
    [messageId: string]: boolean
  }
} */

export interface IFirebaseRtDbChatWithCounter extends IFirebaseRtDbChat{
  uncheckedCounter: number; 
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
  unreadMessages: {
    [uid: string]: {
      [messageId: string]: true | null // true - если смс непрочитано. null отправляется для удаления из базы данных через update
    }
  }
  messages: { [messageId: string]: IMessage }; // Сообщения в чате, где ключ - messageId, а значение - объект IMessage
}

export interface IFirebaseRtDbChatsSnapshot {
  [chatId: string]: IFirebaseRtDbChatsChat; // Объект, где ключ - chatId, а значение - объект чата
}