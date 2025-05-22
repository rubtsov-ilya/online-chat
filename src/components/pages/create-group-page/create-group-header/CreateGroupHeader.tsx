import { FC } from 'react';
import styles from './CreateGroupHeader.module.scss';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import ArrowRightSvg from 'src/assets/images/icons/24x24-icons/Arrow Right.svg?react';
import CheckmarkSvg from 'src/assets/images/icons/24x24-icons/Checkmark.svg?react';
import { useNavigate } from 'react-router-dom';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import {
  ref as refFirebaseDatabase,
  get,
  update,
  serverTimestamp,
} from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { firebaseDatabase } from 'src/firebase';
import useAuth from 'src/hooks/useAuth';
import {
  IFirebaseRtDbChat,
  IFirebaseRtDbChatsChat,
} from 'src/interfaces/FirebaseRealtimeDatabase.interface';
import { useDispatch } from 'react-redux';
import { setActiveChat } from 'src/redux/slices/ActiveChatSlice';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';

interface CreateGroupHeaderProps {
  activeSection: 'add-users' | 'choose-group-name';
  selectedUsers: IUserWithDetails[];
  groupName: string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<'add-users' | 'choose-group-name'>
  >;
  setGroupNameError: React.Dispatch<React.SetStateAction<string>>;
}

const CreateGroupHeader: FC<CreateGroupHeaderProps> = ({
  activeSection,
  selectedUsers,
  groupName,
  setActiveSection,
  setGroupNameError,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid, avatar, username, blocked } = useAuth();
  const onBackBtnClick = () => {
    if (activeSection === 'choose-group-name') {
      setActiveSection('add-users');
    } else {
      navigate('/chats', { replace: true });
    }
  };
  const onForwardBtnClick = () => {
    setActiveSection('choose-group-name');
  };

  const validateInput = (value: string): string => {
    if (value.replace(/\s/g, '').length < 3)
      return 'Минимальная длина 3 символа';
    if (value.replace(/\s/g, '').length > 32)
      return 'Максимальная длина 32 символа';
    const regex = /^[a-zA-Zа-яА-ЯёЁ0-9\s]+$/; // только латиница и кириллица буквы + цифры + пробелы
    if (!regex.test(value)) return 'Допускаются только буквы и цифры';
    // если нет ошибки
    return '';
  };

  const createNewDataForChatsPath = (
    chatId: string,
    usersIds: string[],
    messageText: string,
  ) => {

    const membersObject = usersIds.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {} as Record<string, true>);

    const newChatsData: Omit<IFirebaseRtDbChat, 'lastMessageIsChecked'> = {
      chatId: chatId,
      membersIds: { ...membersObject },
      lastMessageText: messageText,
      lastMessageDateUTC: serverTimestamp(),
      lastMessageSenderUid: uid!,
      groupChatname: groupName,
      groupAvatar: '',
      groupAdminUid: uid!,
      isGroup: true,
    };

    const updatesByUserChats = usersIds.reduce((acc, userId) => {
      acc[`userChats/${userId}/chats/${chatId}`] = newChatsData;
      return acc;
    }, {} as Record<string, Omit<IFirebaseRtDbChat, 'lastMessageIsChecked'>>);

    return { updatesByUserChats: updatesByUserChats, chatId: chatId };
  };

  const createNewChatForChatsPath = async (
    chatId: string,
  ) => {
    const newChatData: Pick<IFirebaseRtDbChatsChat, 'chatId'> = {
      chatId: chatId,
    };

    const chatUpdatesByChats = {
      [`chats/${chatId}`]: newChatData,
    };

    return chatUpdatesByChats;
  };


  const onCreateBtnClick = async () => {
    // условие на active у 'header__create-btn'
    if (groupName.replace(/\s/g, '').length > 3) {
      const validateError = validateInput(groupName);
      if (validateError) {
        // TODO ставить ошибку и отрисовывать ее в инпуте
        setGroupNameError(validateError);
        return;
      } else {
        // TODO создать группу

        const newChatId = uuidv4();

        const allUsersIds = [...selectedUsers.map((user) => user.uid), uid!]

        const updatesByUsers = createNewDataForChatsPath(
          newChatId,
          allUsersIds,
          'Чат создан',
        );

        const { updatesByUserChats, chatId } = updatesByUsers;

        const updatesByChats = await createNewChatForChatsPath(
          chatId
        );

        if (updatesByChats === undefined) {
          return;
        }

        const updates = { ...updatesByUserChats, ...updatesByChats };

        await update(refFirebaseDatabase(firebaseDatabase), updates);

        const membersDetails: IMemberDetails[] = [...selectedUsers.map((user) => ({
          uid: user.uid,
          username: user.username,
          avatar: user.avatar,
          blocked: [],
        })), { uid: uid!, username: username!, avatar: avatar!, blocked: blocked! }]

        dispatch(
          setActiveChat({
            activeChatId: newChatId,
            activeChatAvatar: '',
            activeChatname: groupName,
            activeChatIsGroup: true,
            activeChatMembers: membersDetails,
            activeChatBlocked: [],
            activeChatGroupAdminUrl: uid!,
          }),
        );
        
        navigate(`/chats/chat`, { replace: true });
      }
    }
  };

  return (
    <header className={styles['header']}>
      <div className="container">
        <div className={styles['header__content']}>
          <button
            onClick={onBackBtnClick}
            className={styles['header__back-btn']}
          >
            <LeftChevronSvg className={styles['header__left-chevron-icon']} />
          </button>
          <span className={styles['header__text']}>
            {activeSection === 'add-users'
              ? 'Добавить участников'
              : 'Название группы'}
          </span>
          {selectedUsers.length > 0 && activeSection === 'add-users' && (
            <button
              onClick={onForwardBtnClick}
              className={styles['header__forward-btn']}
            >
              <ArrowRightSvg className={styles['header__arrow-right-icon']} />
            </button>
          )}
          {activeSection === 'choose-group-name' && (
            <button
              onClick={onCreateBtnClick}
              className={styles['header__create-btn']}
            >
              <CheckmarkSvg
                className={`${styles['header__checkmark-icon']} ${groupName.replace(/\s/g, '').length > 3 ? styles['active'] : ''}`}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CreateGroupHeader;
