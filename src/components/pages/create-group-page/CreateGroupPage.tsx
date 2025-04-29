import { FC, useState } from 'react';
import styles from './CreateGroupPage.module.scss';
import CreateGroupHeader from './create-group-header/CreateGroupHeader';
import AddUsersSection from './add-users-section/AddUsersSection';
import ChooseGroupNameSection from './choose-group-name-section/ChooseGroupNameSection';

interface CreateGroupPageProps {}

const CreateGroupPage: FC<CreateGroupPageProps> = ({}) => {
  const [activeSection, setActiveSection] = useState<
    'add-users' | 'choose-group-name'
  >('add-users');
  const [selectedUsers, setSelectedUsers] = useState(['f']);
  const [groupName, setGroupName] = useState<string>('');
  const [groupNameError, setGroupNameError] = useState<string>('');

  return (
    <>
      <CreateGroupHeader
        activeSection={activeSection}
        selectedUsers={selectedUsers}
        groupName={groupName}
        setActiveSection={setActiveSection}
        setGroupNameError={setGroupNameError}
      />
      <main className={styles['create-group-page']}>
        <div className={`${styles['create-group-page__sections-wrapper']} ${ activeSection === 'choose-group-name' ? styles['right'] : ''}`}>
          <AddUsersSection />
          <ChooseGroupNameSection />
        </div>
      </main>
    </>
  );
};

export default CreateGroupPage;
