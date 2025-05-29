import { FC } from 'react';
import styles from './UserList.module.scss';
import usePluralizeMember from 'src/hooks/usePluralizeMember';
import useActiveChat from 'src/hooks/useActiveChat';
import UserAddSvg from 'src/assets/images/icons/24x24-icons/User Add.svg?react';
import ChatInfoUserItem from 'src/components/ui/chat-info-user-item/ChatInfoUserItem';

interface UserListProps {
  openAddUsers: () => void;
}

const UserList: FC<UserListProps> = ({ openAddUsers }) => {
  const { activeChatMembers, activeChatId } = useActiveChat();

  const membersCountString = usePluralizeMember(activeChatMembers || []);

  return (
    <div className={styles['users-list']}>
      <div className={styles['users-list__members-count-wrapper']}>
        <span className={styles['users-list__members-count']}>
          {membersCountString}
        </span>
        <button onClick={openAddUsers} className={styles['users-list__add-button']}>
          <UserAddSvg className={styles['users-list__add-icon']} />
        </button>
      </div>

      {activeChatMembers &&
        activeChatMembers.map((user) => (
          <ChatInfoUserItem
            isSelectable={false}
            key={user.uid}
            user={user}
            activeChatMembers={activeChatMembers}
            activeChatId={activeChatId}
          />
        ))}
    </div>
  );
};

export default UserList;
