import { FC } from 'react';
import styles from './UserList.module.scss';
import {
  GroupedUsersType,
  IUserWithDetails,
} from 'src/interfaces/UserWithDetails.interface';
import CreateGroupUserItem from 'src/components/ui/create-group-user-item/CreateGroupUserItem';

interface UserListProps {
  groupedUsers: GroupedUsersType;
  selectedUsers: IUserWithDetails['uid'][];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

const UserList: FC<UserListProps> = ({
  groupedUsers,
  selectedUsers,
  setSelectedUsers,
}) => {
  return (
    <div className={styles['user-list']}>
      {Object.keys(groupedUsers).map((letter) => (
        <div className={styles['user-list__wrapper']} key={letter}>
          <div className={styles['user-list__letter-wrapper']}>
            <span className={styles['user-list__letter']}>{letter}</span>
          </div>
          <div>
            {groupedUsers[letter].map((user) => (
              <CreateGroupUserItem
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                key={user.uid}
                user={user}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
