import { FC, useEffect, useState } from 'react';
import styles from './ChatInfoSection.module.scss';
import TopBar from './top-bar/TopBar';
import EditingData from './editing-data/EditingData';

interface ChatInfoSectionProps {
  isMobileScreen: boolean | undefined;
  closeChatInfo: () => void;
}

const ChatInfoSection: FC<ChatInfoSectionProps> = ({ isMobileScreen, closeChatInfo }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
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

  return (
    <section
      className={`${styles['chat-info-section']} ${isVisible ? styles['chat-info-section--visible'] : ''}`}
    >
      <TopBar isMobileScreen={isMobileScreen} onCloseBtnClick={onCloseBtnClick} />
      <EditingData isMobileScreen={isMobileScreen} />
    </section>
  );
};

export default ChatInfoSection;
