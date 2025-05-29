import { FC } from 'react';
import styles from './SelectedUserItem.module.scss';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';

interface SelectedUserItemProps {
  user: IUserWithDetails;
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const SelectedUserItem: FC<SelectedUserItemProps> = ({
  user,
  setSelectedUsers,
}) => {
  const splitedUsername = user.username.split(' ');
  const unselectUser = () => {
    setSelectedUsers((prev) =>
      prev.filter((selectedUser) => selectedUser.uid !== user.uid),
    );
  };

  return (
    <div className={styles['selected-user-item']}>
      <div className={styles['selected-user-item__image-wrapper']}>
        <AvatarImage AvatarImg={user.avatar} animated={true} isBig={true} />
        <button
          onClick={unselectUser}
          className={styles['selected-user-item__close-button']}
        >
          <CloseSvg className={styles['selected-user-item__close-icon']} />
        </button>
      </div>
      <div className={styles['selected-user-item__username-wrapper']}> 
        {splitedUsername.map((word, index) => (
          <span key={index} className={styles['selected-user-item__username']}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectedUserItem;
