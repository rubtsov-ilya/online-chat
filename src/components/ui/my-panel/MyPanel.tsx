import useBodyLock from 'src/hooks/useBodyLock';
import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react';
import GroupSvg from 'src/assets/images/icons/24x24-icons/Group.svg?react';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';
import { useDispatch } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { removeUser } from 'src/redux/slices/UserSlice';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';

import MyPanelBtn from '../my-panel-btn/MyPanelBtn';

import styles from './MyPanel.module.scss';
import UploadAvatar from '../upload-avatar/UploadAvatar';
import useToggleModal from 'src/hooks/useToggleModal';
import ModalBackdrop from '../modal-backdrop/ModalBackdrop';
import ModalInputConfirm from '../modal-input-confirm/modalInputConfirm';

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const dispatch = useDispatch();
  const auth = getAuth();
  const { toggleBodyLock } = useBodyLock();
  const { toggleModal } = useToggleModal({ setCbState: setModalOpen });

  const onBackdropClick = (): void => {
    setIsPanelOpen((prev) => !prev);
    toggleBodyLock();
  };

  const onSignOutButtonClick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign-out successful.');
        dispatch(removeUser());
      })
      .catch((error) => {
        console.log(error);
      });
    /* navigate( '/' ) */
  };

  const modalAction = () => {
    console.log(inputValue);
  };

  const validateInput = (value: string): string => {
    if (value.length < 3) return 'Минимальная длина 3 символа';
    if (value.length > 32) return 'Максимальная длина 32 символа';
    /* нет ошибки */
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
            <UploadAvatar userAvatarImg={userAvatarImg} />
            <span className={styles['my-panel__user-name']}>
              {'Andrew Jones Andrew Jones Andrew JonesAndrew Jones'}
            </span>
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
            /* аргумент number в toggleModal - длительность transition opacity в modal-backdrop */
            <ModalBackdrop
              toggleModal={() => toggleModal(false, 100)}
              divIdFromIndexHtml={'modal-backdrop'}
            >
              <ModalInputConfirm
                isMobileScreen={isMobileScreen}
                inputPlaceholder={'Имя'}
                title={'Изменить имя'}
                actionBtnText={'Сохранить'}
                action={modalAction}
                avatar={userAvatarImg}
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
