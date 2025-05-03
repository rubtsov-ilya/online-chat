import { FC } from 'react';
import styles from './CreateGroupUserItem.module.scss';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import AvatarImage from '../avatar-image/AvatarImage';

interface CreateGroupUserItemProps {
  user: IUserWithDetails;
}

const CreateGroupUserItem: FC<CreateGroupUserItemProps> = ({ user }) => {
  return (
    <div className={styles['create-group-user-item']}>
      <AvatarImage AvatarImg={user.avatar} />
      <span className={styles['create-group-user-item__username']}>{user.username}</span>
      {/* <svg /> */}
    </div>
  );
};

export default CreateGroupUserItem;
