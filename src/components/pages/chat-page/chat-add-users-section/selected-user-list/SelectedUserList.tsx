import { FC, useLayoutEffect, useState } from 'react';
import styles from './SelectedUserList.module.scss';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import SelectedUserItem from '../selected-user-item/SelectedUserItem';

interface SelectedUserListProps {
  sectionRef: React.RefObject<HTMLDivElement | null>
  selectedUsers: IUserWithDetails[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
}

const SelectedUserList: FC<SelectedUserListProps> = ({
  selectedUsers,
  sectionRef,
  setSelectedUsers,
}) => {
  const [hasScrollBar, setHasScrollBar] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (sectionRef.current) {
      setHasScrollBar(
        sectionRef.current.scrollWidth > sectionRef.current.clientWidth,
      );
    }
  }, [sectionRef]);

  return (
    <div className={`${styles['selected-user-list']} ${hasScrollBar ? styles['has-scroll'] : ''}`}>
      {selectedUsers.map((user) => (
        <SelectedUserItem
          setSelectedUsers={setSelectedUsers}
          key={user.uid}
          user={user}
        />
      ))}
    </div>
  );
};

export default SelectedUserList;
