import { FC } from 'react';
import styles from './UserItem.module.scss';
import CheckCircleSvg from 'src/assets/images/icons/24x24-icons/Check Circle.svg?react';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';
import { firebaseDatabase } from 'src/firebase';
import { update, ref as refFirebaseDatabase } from 'firebase/database';
import useAuth from 'src/hooks/useAuth';

interface UserItemProps {
  user: IUserWithDetails;
  isSelectable: boolean;
  activeChatMembers: IMemberDetails[];
  activeChatId: string | null;
  selectedUsers?: IUserWithDetails[];
  setSelectedUsers?: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const UserItem: FC<UserItemProps> = ({
  user,
  isSelectable,
  activeChatMembers,
  activeChatId,
  selectedUsers,
  setSelectedUsers,
}) => {
  const { uid } = useAuth()

  const onUserItemClick = () => { 
    // колбек на выделение и тд
  }
  const onBtnClick = async () => {
    if (activeChatId === null || activeChatMembers === null) return;

    try {
      const membersIds = activeChatMembers.map((member) => member.uid);
      const updatesMembersIdsByUserChats = membersIds.reduce(
        (acc, memberId) => {
          if (memberId !== user.uid) {
            acc[
              `userChats/${memberId}/chats/${activeChatId}/membersIds/${user.uid}`
            ] = null;
          }
          return acc;
        },
        {} as Record<string, any>,
      );
      const updatesByKicking = {
        [`userChats/${user.uid}/chats/${activeChatId}`]: null,
        ...updatesMembersIdsByUserChats,
      };

      await update(refFirebaseDatabase(firebaseDatabase), updatesByKicking);
    } catch (error) {
      console.error(`Ошибка исключения пользователя из чата`, error);
    }
  };

  return (
    <div
      onClick={onUserItemClick}
      className={`${styles['user-item']} ${isSelectable ? styles['user-item--pointer'] : ''}`}
    >
      <AvatarImage AvatarImg={user.avatar} />
      <span className={styles['user-item__username']}>
        {user.username}
      </span>
      {isSelectable === true && selectedUsers && selectedUsers.includes(user) && (
        <CheckCircleSvg
          className={styles['user-item__check-circle-icon']}
        />
      )}
      {isSelectable === false && user.uid !== uid &&(
        <button
          onClick={onBtnClick}
          className={styles['user-item__close-button']}
        >
          <CloseSvg className={styles['user-item__close-icon']} />
        </button>
      )}
    </div>
  );
};

export default UserItem;
