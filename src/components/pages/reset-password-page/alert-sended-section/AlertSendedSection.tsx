import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './AlertSendedSection.module.scss';

const AlertSendedSection: FC = () => {
  return (
    <section className={styles['alert-section']}>
      <div className="container">
        <div className={styles['alert-section__content']}>
          <h1 className={styles['alert-section__title']}>Сброс пароля</h1>
          <div className={styles['alert-section__main-wrapper']}>
            <div className={styles['alert']}>
              <h2 className={styles['alert__title']}>Проверьте Вашу почту.</h2>
              <hr className={styles['alert__line']}></hr>
              <Link className={styles['alert__home-link']} to={'/login'}>
                Вернуться ко входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertSendedSection;
