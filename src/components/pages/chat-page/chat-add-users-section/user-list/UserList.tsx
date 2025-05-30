import { FC } from 'react';
import styles from './UserList.module.scss';
import {
  GroupedUsersType,
  IUserWithDetails,
} from 'src/interfaces/UserWithDetails.interface';
import ChatInfoUserItem from 'src/components/ui/chat-info-user-item/ChatInfoUserItem';

interface UserListProps {
  groupedUsers: GroupedUsersType;
  selectedUsers: IUserWithDetails[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const UserList: FC<UserListProps> = ({
  groupedUsers,
  selectedUsers,
  setSelectedUsers,
}) => {
  return (
    <div className={styles['user-list']}>
      {Object.keys(groupedUsers).map((letter) => (
        <div className={`${styles['user-list__wrapper']} ${styles['user-list__wrapper--margin-top']}`} key={letter}>
          <div className={styles['user-list__letter-wrapper']}>
            <span className={styles['user-list__letter']}>{letter}</span>
          </div>
          <div>
            {groupedUsers[letter].map((user) => (
              <ChatInfoUserItem
                isSelectable={true}
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
