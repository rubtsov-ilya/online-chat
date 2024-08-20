import { FC } from 'react';

import AuthForm from 'src/components/ui/auth-form/AuthForm';

import styles from './FirstLoginSection.module.scss';

const FirstLoginSection: FC = () => {
  return (
    <section className={styles['first-section']}>
      <div className={'container container--height'}>
        <div className={styles['first-section__content']}>
          <AuthForm isLogin={true} btnText={'Войти'} />
        </div>
      </div>
    </section>
  );
};

export default FirstLoginSection;
