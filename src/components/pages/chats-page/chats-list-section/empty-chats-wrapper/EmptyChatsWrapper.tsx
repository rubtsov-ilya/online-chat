import { FC } from 'react';
import EmptySvg from 'src/assets/images/icons/24x24-icons/Message.svg?react';

import styles from './EmptyChatsWrapper.module.scss';

interface EmptyChatsWrapperProps {
  text: string;
}

const EmptyChatsWrapper: FC<EmptyChatsWrapperProps> = ({ text }) => {
  return (
    <div className={styles['empty-wrapper']}>
      <div className={styles['empty-wrapper__icon-wrapper']}>
        <EmptySvg
          width={136}
          height={136}
          viewBox="0 0 24 24"
          className={styles['empty-wrapper__svg']}
        />
        <span className={styles['empty-wrapper__text']}>{text}</span>
      </div>
      {/*       <Link to={'/'} className={styles['wrapper__link']}>
        Начать чат
      </Link> */}
    </div>
  );
};

export default EmptyChatsWrapper;
