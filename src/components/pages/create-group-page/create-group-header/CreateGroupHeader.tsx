import { FC } from 'react';
import styles from './CreateGroupHeader.module.scss';
import LeftChevronSvg from 'src/assets/images/icons/24x24-icons/Left Chevron.svg?react';
import ArrowRightSvg from 'src/assets/images/icons/24x24-icons/Arrow Right.svg?react';
import CheckmarkSvg from 'src/assets/images/icons/24x24-icons/Checkmark.svg?react';
import { useNavigate } from 'react-router-dom';

interface CreateGroupHeaderProps {
  activeSection: 'add-users' | 'choose-group-name';
  selectedUsers: string[];
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

  const onCreateBtnClick = () => {
    // условие на active у 'header__create-btn'
    if (groupName.replace(/\s/g, '').length > 3) {
      const validateError = validateInput(groupName);
      if (validateError) {
        // TODO ставить ошибку и отрисовывать ее в инпуте
        setGroupNameError(validateError);
        return;
      } else {
        // TODO создать группу и navigate в неё
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
