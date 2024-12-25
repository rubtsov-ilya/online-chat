import { IFirebaseRtDbChat } from "./firebaseRealtimeDatabase.interface";



export interface IMemberDetails {
  uid: string;
  username: string;
  avatar: string;
  blocked: string[];
}

export interface IChatsWithDetails extends IFirebaseRtDbChat {
  membersDetails: IMemberDetails[]
}