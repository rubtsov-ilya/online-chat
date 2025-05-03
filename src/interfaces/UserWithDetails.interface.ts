export interface IUserWithDetails {
  uid: string;
  username: string;
  avatar: string;
}

export type GroupedUsersType = Record<string, IUserWithDetails[]>;