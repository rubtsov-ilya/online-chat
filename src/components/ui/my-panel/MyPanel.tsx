import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react';
import GroupSvg from 'src/assets/images/icons/24x24-icons/Group.svg?react';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';
import { useDispatch } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { removeUser } from 'src/redux/slices/UserSlice';

import MyPanelBtn from '../my-panel-btn/MyPanelBtn';

import styles from './MyPanel.module.scss';
import UploadAvatar from '../upload-avatar/UploadAvatar';
import useToggleModal from 'src/hooks/useToggleModal';
import ModalBackdrop from '../modal-backdrop/ModalBackdrop';
import ModalInputConfirm from '../modal-input-confirm/ModalInputConfirm';
import useAuth from 'src/hooks/useAuth';
import { firebaseDatabase } from 'src/firebase';
import { ref, update } from 'firebase/database';
import useBodyLockContext from 'src/hooks/useBodyLockContext';
import useNormalizedUsername from 'src/hooks/useNormalizedUsername';

interface MyPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileScreen: boolean;
}

const MyPanel: FC<MyPanelProps> = ({
  isMobileScreen,
  isPanelOpen,
  setIsPanelOpen,
}) => {
  const { avatar: userAvatar, uid, username } = useAuth();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const dispatch = useDispatch();
  const auth = getAuth();
  const { toggleBodyLock } = useBodyLockContext();
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });
  const modalDuration = 100;

  const onBackdropClick = (): void => {
    setIsPanelOpen((prev) => !prev);
    toggleBodyLock();
  };

  const onSignOutButtonClick = () => {
    const userRef = ref(firebaseDatabase, `users/${uid}`);
    update(userRef, { isOnline: false }); // установка статуса оффлайн
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
        dispatch(removeUser());
        localStorage.removeItem('existingDataByUser');
      })
      .catch((error) => {
        console.log(error);
      });
    /* navigate( '/' ) */
  };

  const modalAction = async () => {
    const userRef = ref(firebaseDatabase, `users/${uid}`);
    await update(userRef, {
      username: inputValue,
      usernameNormalized: useNormalizedUsername(inputValue),
    });
    setInputValue('');
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

  return createPortal(
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      className={styles['stop-propagation-wrapper']}
    >
      <div
        onClick={onBackdropClick}
        className={`${styles['my-panel-backdrop']} ${isPanelOpen ? styles['active'] : ''}`}
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          className={styles['my-panel']}
        >
          <div className={styles['my-panel__user-wrapper']}>
            <UploadAvatar uid={uid!} userAvatar={userAvatar!} />
            <span className={styles['my-panel__user-name']}>{username}</span>
          </div>
          <MyPanelBtn
            Svg={PencilSvg}
            onBtnClick={() => toggleModal(true)}
            text={'Изменить имя'}
          />
          <MyPanelBtn
            Svg={GroupSvg}
            onBtnClick={() => {}}
            text={'Новая группа'}
          />
          <MyPanelBtn
            Svg={UserSvg}
            onBtnClick={onSignOutButtonClick}
            text={'Выйти'}
          />
          {modalOpen && (
            <ModalBackdrop
              transitionDuration={modalDuration}
              toggleModal={() => toggleModal(false, modalDuration)}
              divIdFromIndexHtml={'modal-backdrop'}
            >
              <ModalInputConfirm
                isMobileScreen={isMobileScreen}
                inputPlaceholder={'Имя'}
                title={'Изменить имя'}
                actionBtnText={'Сохранить'}
                action={modalAction}
                avatar={userAvatar!}
                widthStyle={'300px'}
                inputValue={inputValue}
                setInputValue={setInputValue}
                validateInput={validateInput}
              />
            </ModalBackdrop>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('my-panel') as HTMLDivElement,
  );
};

export default MyPanel;
