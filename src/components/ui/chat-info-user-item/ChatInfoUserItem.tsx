import { FC } from 'react';
import styles from './ChatInfoUserItem.module.scss';
import CheckCircleSvg from 'src/assets/images/icons/24x24-icons/Check Circle.svg?react';
import CloseSvg from 'src/assets/images/icons/24x24-icons/Close.svg?react';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';
import { firebaseDatabase } from 'src/firebase';
import { update, ref as refFirebaseDatabase } from 'firebase/database';
import useAuth from 'src/hooks/useAuth';

interface ChatInfoUserItemProps {
  user: IUserWithDetails;
  isSelectable: boolean;
  activeChatMembers?: IMemberDetails[];
  activeChatId?: string | null;
  selectedUsers?: IUserWithDetails[];
  hasNoPadding?: boolean;
  setSelectedUsers?: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const ChatInfoUserItem: FC<ChatInfoUserItemProps> = ({
  user,
  isSelectable,
  activeChatMembers,
  activeChatId,
  selectedUsers,
  hasNoPadding,
  setSelectedUsers,
}) => {
  const { uid } = useAuth()

  const onUserItemClick = () => { 
    if (selectedUsers == null || setSelectedUsers == null) return;

    if (selectedUsers.includes(user)) {
      setSelectedUsers((prev) =>
        prev.filter((selectedUser) => selectedUser.uid !== user.uid),
      );
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  }
  const onBtnClick = async () => {
    if (activeChatId == null || activeChatMembers == null) return;

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
      className={`${styles['chat-info-user-item']} ${isSelectable ? styles['chat-info-user-item--pointer'] : ''}  ${hasNoPadding ? styles['chat-info-user-item--no-padding'] : ''}`}
    >
      <AvatarImage AvatarImg={user.avatar} />
      <span className={styles['chat-info-user-item__username']}>
        {user.username}
      </span>
      {isSelectable === true && selectedUsers && selectedUsers.includes(user) && (
        <CheckCircleSvg
          className={styles['chat-info-user-item__check-circle-icon']}
        />
      )}
      {isSelectable === false && user.uid !== uid &&(
        <button
          onClick={onBtnClick}
          className={styles['chat-info-user-item__close-button']}
        >
          <CloseSvg className={styles['chat-info-user-item__close-icon']} />
        </button>
      )}
    </div>
  );
};

export default ChatInfoUserItem;
