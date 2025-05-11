import { FC } from 'react';
import styles from './CreateGroupUserItem.module.scss';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import AvatarImage from '../avatar-image/AvatarImage';
import CheckCircleSvg from 'src/assets/images/icons/24x24-icons/Check Circle.svg?react';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';

interface CreateGroupUserItemProps {
  user: IUserWithDetails;
  selectedUsers: IUserWithDetails[];
  activeSection: 'add-users' | 'choose-group-name';
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const CreateGroupUserItem: FC<CreateGroupUserItemProps> = ({
  user,
  selectedUsers,
  activeSection,
  setSelectedUsers,
}) => {
  const onUserItemClick = () => {
    if (activeSection === 'add-users') {
      if (selectedUsers.includes(user)) {
        setSelectedUsers((prev) =>
          prev.filter((selectedUser) => selectedUser.uid !== user.uid),
        );
      } else {
        setSelectedUsers((prev) => [...prev, user]);
      }
    }
  };

  const unselectUser = () => {
    setSelectedUsers((prev) =>
      prev.filter((selectedUser) => selectedUser.uid !== user.uid),
    );
  };

  return (
    <div style={{cursor: `${activeSection === 'add-users' ? 'pointer' : 'default'}`}} onClick={onUserItemClick} className={styles['create-group-user-item']}>
      <AvatarImage AvatarImg={user.avatar} />
      <span className={styles['create-group-user-item__username']}>
        {user.username}
      </span>
      {activeSection === 'add-users' && selectedUsers.includes(user) && (
        <CheckCircleSvg
          className={styles['create-group-user-item__check-circle-icon']}
        />
      )}
      {activeSection === 'choose-group-name' && selectedUsers.length > 1 &&
        selectedUsers.includes(user) && (
          <button
            onClick={unselectUser}
            className={styles['create-group-user-item__close-button']}
          >
            <CloseSvg className={styles['create-group-user-item__close-icon']} />
          </button>
        )}
    </div>
  );
};

export default CreateGroupUserItem;
