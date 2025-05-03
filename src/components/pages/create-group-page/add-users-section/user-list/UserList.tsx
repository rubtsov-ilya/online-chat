import { FC } from 'react';
import styles from './UserList.module.scss';
import { GroupedUsersType } from 'src/interfaces/UserWithDetails.interface';
import CreateGroupUserItem from 'src/components/ui/create-group-user-item/CreateGroupUserItem';

interface UserListProps {
  groupedUsers: GroupedUsersType
}

const UserList: FC<UserListProps> = ({ groupedUsers }) => {
  return (
    <div className={styles['user-list']}>
      {Object.keys(groupedUsers).map((letter) => (
        <div className={styles['user-list__wrapper']} key={letter}>
          <div className={styles['user-list__letter-wrapper']}>
            <span className={styles['user-list__letter']}>{letter}</span>
          </div>
          <div>
            {groupedUsers[letter].map((user) => (
              <CreateGroupUserItem key={user.uid} user={user} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
