import { FC } from 'react';
import styles from './UserList.module.scss';
import usePluralizeMember from 'src/hooks/usePluralizeMember';
import useActiveChat from 'src/hooks/useActiveChat';
import UserAddSvg from 'src/assets/images/icons/24x24-icons/User Add.svg?react';
import ChatInfoUserItem from 'src/components/ui/chat-info-user-item/ChatInfoUserItem';
import { sort } from 'fast-sort';

interface UserListProps {
  openAddUsers: () => void;
}

const UserList: FC<UserListProps> = ({ openAddUsers }) => {
  const { activeChatMembers, activeChatId } = useActiveChat();

    // Функция для определения приоритета символа
    const getCharPriority = (char: string): number => {
      if (char >= 'А' && char <= 'Я') return 0; // Русские буквы
      if (char >= 'Ё') return 0; // Ё — особый случай
      if (char >= 'A' && char <= 'Z') return 1; // Английские буквы
      if (char >= '0' && char <= '9') return 2; // Цифры
      return 3; // Остальное
    };
  
    // Получаем приоритет первого символа username
    const getSortValue = (user: { username: string }) => {
      const firstChar = user.username.charAt(0);
      return getCharPriority(firstChar);
    };
  
    // Сортировка с учётом приоритета и алфавитного порядка
    const sortedMembers = activeChatMembers !== null ? sort(activeChatMembers).by([
      { asc: (user) => getSortValue(user) }, // сначала по группам
      { asc: (user) => user.username.toLowerCase().replace(/\s/g, '') }, // потом по имени
    ]) : [];

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
        sortedMembers.map((user) => (
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
