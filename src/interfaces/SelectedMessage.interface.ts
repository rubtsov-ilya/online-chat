import { IMessage } from "./Message.interface";

export interface ISelectedMessage extends Pick<IMessage, 'messageId' | 'messageDateUTC'> {}