import { FC, useState } from 'react';
import styles from './NameAndAvatar.module.scss';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';
import useActiveChat from 'src/hooks/useActiveChat';
import CheckmarkSvg  from 'src/assets/images/icons/24x24-icons/Checkmark.svg?react';

interface NameAndAvatarProps {}

const NameAndAvatar: FC<NameAndAvatarProps> = ({}) => {
  const { activeChatname, activeChatAvatar } = useActiveChat();
  const [groupName, setGroupName] = useState<string>(activeChatname || '');
  const [groupNameError, setGroupNameError] = useState<string>('');

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

  const onConfirmButtonClick = (groupNameDuringConfirming: string) => {
    if (groupNameDuringConfirming === activeChatname) {
      return
    }
    const validateError = validateInput(groupNameDuringConfirming);
    if (validateError) {
      // TODO ставить ошибку и отрисовывать ее в инпуте
      setGroupNameError(validateError);
      return;
    } else {

    }
  };

  return (
    <div className={styles['name-and-avatar']}>
      {groupNameError && (
        <label
          className={styles['name-and-avatar__label']}
          htmlFor="groupNameInput"
        >
          {groupNameError}
        </label>
      )}

      <div className={styles['name-and-avatar__wrapper']}>
        <AvatarImage AvatarImg={activeChatAvatar || ''} isGroup={true} />
        {/*  здесь переделать UploadAvatar */}
        <input
          id="groupNameInput"
          value={groupName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGroupName(e.target.value)
          }
          className={styles['name-and-avatar__input']}
          placeholder="Название группы"
        />
        <button
          className={styles['name-and-avatar__confirm-button']}
          onClick={() => onConfirmButtonClick(groupName)}
          disabled={activeChatname === groupName}
        >
          <CheckmarkSvg className={`${styles['name-and-avatar__confirm-icon']} ${activeChatname !== groupName ? styles['name-and-avatar__confirm-icon--active'] : ''}`}/>
        </button>
      </div>
    </div>
  );
};

export default NameAndAvatar;
