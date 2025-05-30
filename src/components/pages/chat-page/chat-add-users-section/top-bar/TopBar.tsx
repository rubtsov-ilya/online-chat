import { FC } from 'react';
import styles from './TopBar.module.scss';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import CheckmarkSvg from 'src/assets/images/icons/24x24-icons/Checkmark.svg?react';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import {
  ref as refFirebaseDatabase,
  update,
  get,
} from 'firebase/database';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import useActiveChat from 'src/hooks/useActiveChat';

interface CreateGroupHeaderProps {
  selectedUsers: IUserWithDetails[];
  isMobileScreen: boolean | undefined;
  onCloseBtnClick: () => void
}

const TopBar: FC<CreateGroupHeaderProps> = ({ selectedUsers, isMobileScreen, onCloseBtnClick }) => {
  const { uid } = useAuth();
  const { activeChatId } = useActiveChat()

  const createNewDataForChatsPathByUsers = (
    selectedUsersIds: string[],
    chatsData: IFirebaseRtDbChat
  ) => {

    const membersObject = selectedUsersIds.reduce(
      (acc, id) => {
        acc[id] = true;
        return acc;
      },
      {} as Record<string, true>,
    );

    const newChatsData: IFirebaseRtDbChat = {
      ...chatsData,
      membersIds: { ...chatsData.membersIds, ...membersObject },
    };

    const updatesUserChatsBySelectedUsers = selectedUsersIds.reduce(
      (acc, userId) => {
        acc[`userChats/${userId}/chats/${activeChatId}`] = newChatsData;
        return acc;
      },
      {} as Record<string, IFirebaseRtDbChat>,
    );

    const updatesUserChatsByOldUsers = Object.keys(chatsData.membersIds).reduce(
      (acc, userId) => {
        selectedUsersIds.forEach(selectedUserId => {
          acc[`userChats/${userId}/chats/${activeChatId}/membersIds/${selectedUserId}`] = true;
        });
        return acc;
      },
      {} as Record< string, boolean>,
    );

    const updates = {
      ...updatesUserChatsBySelectedUsers,
      ...updatesUserChatsByOldUsers,
    };

    return updates;
  };

  const onAddBtnClick = async () => {
    if (selectedUsers.length === 0) {
      return
    }
    
    const chatFromUserChatsRef = refFirebaseDatabase(
      firebaseDatabase,
      `userChats/${uid}/chats/${activeChatId}`,
    );

    try {
      const chatFromUserChatsSnapshot = await get(chatFromUserChatsRef);

      if (chatFromUserChatsSnapshot.exists()) {
        const chatFromUserChatsValue = chatFromUserChatsSnapshot.val() as IFirebaseRtDbChat;

        const allSelectedUsersIds = [...selectedUsers.map((user) => user.uid)];

        const updatesByUsers = createNewDataForChatsPathByUsers(
          allSelectedUsersIds,
          chatFromUserChatsValue
        );

        console.table(updatesByUsers)

        await update(refFirebaseDatabase(firebaseDatabase), updatesByUsers);
        onCloseBtnClick();

      }
    } catch (error) {
      console.error(
        `Ошибка при добавлении участников`,
        error,
      );
    }
  }
  

  return (
    <div className={styles['top-bar']}>
      <div className={`container ${isMobileScreen ? '' : 'container--max-width-unset'}`}>
        <div className={styles['top-bar__content']}>
          <button
            onClick={onCloseBtnClick}
            className={styles['top-bar__back-btn']}
          >
            <LeftChevronSvg className={styles['top-bar__left-chevron-icon']} />
          </button>
          <span className={styles['top-bar__text']}>
            {'Добавить участников'}
          </span>

          <button
            onClick={onAddBtnClick}
            disabled={selectedUsers.length === 0}
            className={styles['top-bar__create-btn']}
          >
            <CheckmarkSvg
              className={`${styles['top-bar__checkmark-icon']} ${selectedUsers.length > 0 ? styles['active'] : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
