import { IFirebaseRtDbChatWithCounter } from "./FirebaseRealtimeDatabase.interface";



export interface IMemberDetails {
  uid: string;
  username: string;
  avatar: string;
  blocked: string[];
}

/* export interface IMemberDetailsWithoutBlocked extends Omit<IMemberDetails, 'blocked'> {
} */

export interface IChatWithDetails extends IFirebaseRtDbChatWithCounter {
  membersDetails: IMemberDetails[]
}