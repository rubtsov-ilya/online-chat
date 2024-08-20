import { FC } from 'react';

import styles from './ChatsDefaultSection.module.scss';

const DefaultChatSection: FC = () => {
  return (
    <section className={styles['default-chats-section']}>
      <div
        className={'container container--height container--max-width-unset '}
      >
        <div className={styles['default-chats-section__content']}>
          <div className={styles['default-chats-section__title-wrapper']}>
            <h1 className={styles['default-chats-section__title']}>
              Выберите, кому хотите написать
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DefaultChatSection;
