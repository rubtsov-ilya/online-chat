import { FC } from 'react';
import styles from './AddUsersSection.module.scss';

interface AddUsersSectionProps {

}

const AddUsersSection: FC<AddUsersSectionProps> = ({ }) => {
  return (
    <div className={styles['AddUsersSection']}>
      AddUsersSection
    </div>
  );
};

export default AddUsersSection;