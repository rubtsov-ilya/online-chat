import useBodyLock from 'src/hooks/useBodyLock';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react';
import GroupSvg from 'src/assets/images/icons/24x24-icons/Group.svg?react';
import UserSvg from 'src/assets/images/icons/24x24-icons/User.svg?react';
import { useDispatch } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { removeUser } from 'src/redux/slices/UserSlice';
import userAvatarImg from 'src/assets/images/icons/dev-icons/avatar.jpg';

import MyPanelBtn from '../my-panel-btn/MyPanelBtn';
import AvatarImage from '../avatar-image/AvatarImage';

import styles from './MyPanel.module.scss';

interface MyPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyPanel: FC<MyPanelProps> = ({ isPanelOpen, setIsPanelOpen }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const { toggleBodyLock } = useBodyLock();

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
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

  return createPortal(
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      className={styles['stop-propagation-wrapper']}
    >
      <div
        onClick={onBackdropClick}
        className={
          isPanelOpen
            ? `${styles['my-panel-backdrop']} ${styles['active']}`
            : styles['my-panel-backdrop']
        }
      >
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          className={styles['my-panel']}
        >
          <div className={styles['my-panel__user-wrapper']}>
            <AvatarImage userAvatarImg={userAvatarImg} />
            <p className={styles['my-panel__user-name']}>{'Andrew Jones'}</p>
          </div>
          <MyPanelBtn
            Svg={PencilSvg}
            onBtnClick={() => {}}
            text={'Новый чат'}
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
        </div>
      </div>
    </div>,
    document.getElementById('my-panel') as HTMLDivElement,
  );
};

export default MyPanel;
