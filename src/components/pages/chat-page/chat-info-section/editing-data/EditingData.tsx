import { FC } from 'react';
import styles from './EditingData.module.scss';
import NameAndAvatar from '../name-and-avatar/NameAndAvatar';
import UserList from '../user-list/UserList';

interface EditingDataProps {
  isMobileScreen: boolean | undefined;
  openAddUsers: () => void
}

const EditingData: FC<EditingDataProps> = ({ isMobileScreen, openAddUsers}) => {
  return (
    <div className={styles['editing-data']}>
      <div
        className={`container container--height container--no-padding ${isMobileScreen ? '' : 'container--max-width-unset'}`}
      >
        <div className={styles['editing-data__content']}>
          <NameAndAvatar />
          <UserList openAddUsers={openAddUsers} />
        </div>
      </div>
    </div>
  );
};

export default EditingData;
