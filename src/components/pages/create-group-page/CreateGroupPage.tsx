import { FC, useState } from 'react';
import styles from './CreateGroupPage.module.scss';
import CreateGroupHeader from './create-group-header/CreateGroupHeader';
import AddUsersSection from './add-users-section/AddUsersSection';
import ChooseGroupNameSection from './choose-group-name-section/ChooseGroupNameSection';
import useMobileScreen from 'src/hooks/useMobileScreen';
import { IUserWithDetails } from 'src/interfaces/UserWithDetails.interface';

interface CreateGroupPageProps {}

const CreateGroupPage: FC<CreateGroupPageProps> = ({}) => {
  const [activeSection, setActiveSection] = useState<
    'add-users' | 'choose-group-name'
  >('add-users');
  const [selectedUsers, setSelectedUsers] = useState<IUserWithDetails['uid'][]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [groupNameError, setGroupNameError] = useState<string>('');
  const { isMobileScreen } = useMobileScreen();

  return (
    <div className={styles['create-group-page']}>
      <CreateGroupHeader
        activeSection={activeSection}
        selectedUsers={selectedUsers}
        groupName={groupName}
        setActiveSection={setActiveSection}
        setGroupNameError={setGroupNameError}
      />
      <main className={styles['create-group-page__main']}>
        <div
          className={`${styles['create-group-page__sections-wrapper']} ${activeSection === 'choose-group-name' ? styles['right'] : ''}`}
        >
          <AddUsersSection
            isMobileScreen={isMobileScreen}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
          <ChooseGroupNameSection />
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage;
