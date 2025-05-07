import { FC } from 'react';
import styles from './CreateGroupUserItem.module.scss';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import AvatarImage from '../avatar-image/AvatarImage';
import CheckCircleSvg from 'src/assets/images/icons/24x24-icons/Check Circle.svg?react'

interface CreateGroupUserItemProps {
  user: IUserWithDetails;
  selectedUsers: IUserWithDetails['uid'][];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

const CreateGroupUserItem: FC<CreateGroupUserItemProps> = ({
  user,
  selectedUsers,
  setSelectedUsers,
}) => {
  
  const onUserItemClick = () => { 
    console.log(selectedUsers)
    if (selectedUsers.includes(user.uid)) {
      setSelectedUsers((prev) => prev.filter((uid) => uid !== user.uid) )
    } else {
      setSelectedUsers((prev) => [...prev, user.uid] )
    }
   }
  return (
    <div onClick={onUserItemClick} className={styles['create-group-user-item']}>
      <AvatarImage AvatarImg={user.avatar} />
      <span className={styles['create-group-user-item__username']}>
        {user.username}
      </span>
      {selectedUsers.includes(user.uid) && <CheckCircleSvg className={styles['create-group-user-item__check-circle-icon']} />}
    </div>
  );
};

export default CreateGroupUserItem;
