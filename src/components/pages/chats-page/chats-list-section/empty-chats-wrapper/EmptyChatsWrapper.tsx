import { FC } from 'react';
import EmptySvg from 'src/assets/images/icons/24x24-icons/Message.svg?react';
import { Link } from 'react-router-dom';

import styles from './EmptyChatsWrapper.module.scss';

const EmptyChatsWrapper: FC = () => {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['icon-wrapper']}>
        <EmptySvg
          width={136}
          height={136}
          viewBox="0 0 24 24"
          className={styles['icon-wrapper__svg']}
        />
        <span className={styles['icon-wrapper__text']}>Начните общаться!</span>
      </div>
      <Link to={'/'} className={styles['wrapper__link']}>
        Начать чат
      </Link>
    </div>
  );
};

export default EmptyChatsWrapper;
