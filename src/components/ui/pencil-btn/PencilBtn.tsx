import { FC, useState } from 'react';
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react';
import MyPanel from '../my-panel/MyPanel';

import styles from './PencilBtn.module.scss';
import useBodyLockContext from 'src/hooks/useBodyLockContext';

interface PencilBtnProps {
  isMobileScreen: boolean;
}

const PencilBtn: FC<PencilBtnProps> = ({ isMobileScreen }) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const { toggleBodyLock } = useBodyLockContext();

  const onBtnClick = (): void => {
    setIsPanelOpen((prev) => !prev);
    toggleBodyLock();
  };

  return (
    <div onClick={onBtnClick} className={styles['btn']}>
      <PencilSvg className={styles['btn__svg']} />
      <MyPanel
        isMobileScreen={isMobileScreen}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
      />
    </div>
  );
};

export default PencilBtn;
