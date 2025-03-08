import { firebaseDatabase } from 'src/firebase';
import {
  endAt,
  get,
  limitToFirst,
  orderByChild,
  query,
  ref as refFirebaseDatabase,
  startAt,
} from 'firebase/database';
import { IFirebaseRtDbUser } from 'src/interfaces/FirebaseRealtimeDatabase.interface';

const getSearchedUsersService = async (searchInputValue: string) => {
  const usersRef = refFirebaseDatabase(firebaseDatabase, `users/`);
  const usersQuery = query(
    usersRef,
    orderByChild('usernameNormalized'),
    startAt(searchInputValue),
    endAt(searchInputValue + '\uf8ff'), // '\uf8ff' используется для определения диапазона
    limitToFirst(10), 
  );

  const usersSnapshot = await get(usersQuery);
  if (usersSnapshot.exists()) {
    const userAvatarValue = usersSnapshot.val();
    const usersArray: IFirebaseRtDbUser[] = Object.values(userAvatarValue);

    const filteredUsers = usersArray.filter((user: IFirebaseRtDbUser) =>
      user.usernameNormalized.includes(searchInputValue),
    );
    return filteredUsers;
  }
};

export default getSearchedUsersService
/* 
const updatesByUserChats = membersIds.reduce(
  (acc, memberId) => {
    acc[`userChats/${memberId}/chats/${chatId}/lastMessageText`] =
      newChatsData.lastMessageText;
    acc[`userChats/${memberId}/chats/${chatId}/lastMessageDateUTC`] =
      newChatsData.lastMessageDateUTC;
    acc[`userChats/${memberId}/chats/${chatId}/lastMessageIsChecked`] =
      newChatsData.lastMessageIsChecked;
    acc[`userChats/${memberId}/chats/${chatId}/lastMessageSenderUid`] =
      newChatsData.lastMessageSenderUid;
    return acc;
  },
  {} as Record<string, any>,
);

return updatesByUserChats; */