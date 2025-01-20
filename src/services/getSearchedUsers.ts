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

export const getSearchedUsersService = async (searchInputValue: string) => {
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
    console.log(usersArray)
    const filteredUsers = usersArray.filter((user: IFirebaseRtDbUser) =>
      user.usernameNormalized.includes(searchInputValue),
    );
    return filteredUsers;
  } else {
    return 'error';
  }
};
