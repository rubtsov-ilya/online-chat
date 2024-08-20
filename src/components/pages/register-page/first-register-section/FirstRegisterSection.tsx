import { FC } from 'react';

import AuthForm from 'src/components/ui/auth-form/AuthForm';

import styles from './FirstRegisterSection.module.scss';

const FirstRegisterSection: FC = () => {
  return (
    <section className={styles['first-section']}>
      <div className={'container container--height'}>
        <div className={styles['first-section__content']}>
          <AuthForm btnText={'Зарегистрироваться'} isRegister={true} />
        </div>
      </div>
    </section>
  );
};

export default FirstRegisterSection;
