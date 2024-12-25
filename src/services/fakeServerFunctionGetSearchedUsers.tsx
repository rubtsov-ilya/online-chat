import { firebaseDatabase } from 'src/firebase';
import { get, ref as refFirebaseDatabase } from 'firebase/database';
import { IFirebaseRtDbUser } from 'src/interfaces/firebaseRealtimeDatabase.interface';

export const fakeServerFunctionGetSearchedUsers = async (
  searchInputValue: string,
) => {
  // эмуляция серверной функции
  // должна быть серверная функция с поиском по именам пользователей,
  // однако firebase в бесплатном тарифе не предоставляет серверные функции
  const usersRef = refFirebaseDatabase(firebaseDatabase, `users/`);

  const usersSnapshot = await get(usersRef);
  if (usersSnapshot.exists()) {
    const userAvatarValue = usersSnapshot.val();
    const usersArray: IFirebaseRtDbUser[] = Object.values(userAvatarValue);
    const filteredUsers = usersArray
      .filter((user: any) =>
        user.username
          ?.toLowerCase()
          .replace(/\s+/g, '')
          .includes(searchInputValue.toLowerCase().replace(/\s+/g, '')),
      )
      .slice(0, 10); // ограничение в количестве результатов - 10
    return filteredUsers;
  } else {
    return 'error';
  }
};
