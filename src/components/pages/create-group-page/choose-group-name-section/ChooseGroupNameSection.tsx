import { FC } from 'react';
import styles from './ChooseGroupNameSection.module.scss';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';
import CreateGroupUserItem from 'src/components/ui/create-group-user-item/CreateGroupUserItem';
import usePluralizeMember from 'src/hooks/usePluralizeMember';

interface ChooseGroupNameSectionProps {
  selectedUsers: IUserWithDetails[];
  groupNameError: string;
  isMobileScreen: boolean;
  activeSection: 'add-users' | 'choose-group-name';
  groupName: string;
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUserWithDetails[]>>;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
}

const ChooseGroupNameSection: FC<ChooseGroupNameSectionProps> = ({
  groupNameError,
  selectedUsers,
  isMobileScreen,
  activeSection,
  groupName,
  setSelectedUsers,
  setGroupName,
}) => {

  const membersCountString = usePluralizeMember(selectedUsers);

  return (
    <section className={styles['choose-group-name-section']}>
      <div
        className={`container container--height ${isMobileScreen ? 'container--no-padding' : ''}`}
      >
        <div className={styles['choose-group-name-section__content']}>
          {groupNameError && (
            <label
              className={styles['choose-group-name-section__label']}
              htmlFor="groupNameInput"
            >
              {groupNameError}
            </label>
          )}

          <input
            id="groupNameInput"
            value={groupName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGroupName(e.target.value)
            }
            className={styles['choose-group-name-section__input']}
            placeholder="Название группы"
          />
          <div
            className={
              styles['choose-group-name-section__members-count-wrapper']
            }
          >
            <span
              className={styles['choose-group-name-section__members-count']}
            >
              {membersCountString}
            </span>
          </div>

          {selectedUsers.map((user) => (
            <CreateGroupUserItem
              activeSection={activeSection}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              key={user.uid}
              user={user}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseGroupNameSection;
