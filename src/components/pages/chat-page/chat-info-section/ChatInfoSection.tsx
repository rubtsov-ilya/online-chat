import { FC, useEffect, useState } from 'react';
import styles from './ChatInfoSection.module.scss';
import TopBar from './top-bar/TopBar';
import EditingData from './editing-data/EditingData';
import useToggleModal from 'src/hooks/useToggleModal';
import ChatAddUsersSection from '../chat-add-users-section/ChatAddUsersSection';

interface ChatInfoSectionProps {
  isMobileScreen: boolean | undefined;
  closeChatInfo: () => void;
}

const ChatInfoSection: FC<ChatInfoSectionProps> = ({
  isMobileScreen,
  closeChatInfo,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAddUsersOpen, setIsAddUsersOpen] = useState<boolean>(false);
  const { toggleModal } = useToggleModal({ setCbState: setIsAddUsersOpen });

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => {};
  }, []);

  const onCloseBtnClick = () => {
    setIsVisible(false);
    closeChatInfo();
  };

  const closeAddUsers = () => {
    toggleModal(false, 150);
  };

  const openAddUsers = () => {
    toggleModal(true);
  };

  return (
    <section
      className={`${styles['chat-info-section']} ${isVisible ? styles['chat-info-section--visible'] : ''}`}
    >
      {isAddUsersOpen && (
        <ChatAddUsersSection
          isMobileScreen={isMobileScreen}
          closeAddUsers={closeAddUsers}
        />
      )}
      <TopBar
        isMobileScreen={isMobileScreen}
        onCloseBtnClick={onCloseBtnClick}
      />
      <EditingData openAddUsers={openAddUsers} isMobileScreen={isMobileScreen} />
    </section>
  );
};

export default ChatInfoSection;
