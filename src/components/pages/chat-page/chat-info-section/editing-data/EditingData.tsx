import { FC } from 'react';
import styles from './EditingData.module.scss';
import NameAndAvatar from '../name-and-avatar/NameAndAvatar';

interface EditingDataProps {
  isMobileScreen: boolean | undefined;
}

const EditingData: FC<EditingDataProps> = ({ isMobileScreen }) => {

  return (
    <div className={styles['editing-data']}>
      <div
        className={`container container--height container--no-padding ${isMobileScreen ? '' : 'container--max-width-unset'}`}
      >
        <NameAndAvatar />
      </div>
    </div>
  );
};

export default EditingData;
