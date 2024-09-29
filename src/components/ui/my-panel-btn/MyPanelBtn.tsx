import { FC } from 'react';

import styles from './MyPanelBtn.module.scss';

interface MyPanelBtnProps {
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onBtnClick: () => any;
  text: string;
}

const MyPanelBtn: FC<MyPanelBtnProps> = ({ Svg, onBtnClick, text }) => {
  return (
    <button onClick={onBtnClick} className={styles['btn']}>
      <Svg className={styles['btn__svg']} />
      <span className={styles['btn__text']}>{text}</span>
    </button>
  );
};

export default MyPanelBtn;
