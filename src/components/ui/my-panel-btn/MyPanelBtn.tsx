import { FC } from 'react';

import styles from './MyPanelBtn.module.scss';

interface MyPanelBtnProps {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onBtnClick: () => void;
  text: string;
}

const MyPanelBtn: FC<MyPanelBtnProps> = ({ Svg, onBtnClick, text }) => {
  return (
    <button tabIndex={1} onClick={onBtnClick} className={styles['btn']}>
      <Svg className={styles['btn__svg']} />
      <span className={styles['btn__text']}>{text}</span>
    </button>
  );
};

export default MyPanelBtn;
