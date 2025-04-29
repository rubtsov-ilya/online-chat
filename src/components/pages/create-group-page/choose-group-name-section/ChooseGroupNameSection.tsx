import { FC } from 'react';
import styles from './ChooseGroupNameSection.module.scss';

interface ChooseGroupNameSectionProps {

}

const ChooseGroupNameSection: FC<ChooseGroupNameSectionProps> = ({ }) => {
  return (
    <section className={styles['choose-group-name-section']}>
      <div className={'container'}>
        <div className={styles['choose-group-name-section__content']}>
          a
        </div>
      </div>
    </section>
  );
};

export default ChooseGroupNameSection;