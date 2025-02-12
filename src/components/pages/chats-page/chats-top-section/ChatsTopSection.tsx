import { FC } from 'react';
import PencilBtn from 'src/components/ui/pencil-btn/PencilBtn';
import AvatarImage from 'src/components/ui/avatar-image/AvatarImage';

import styles from './ChatsTopSection.module.scss';
import useAuth from 'src/hooks/useAuth';

interface ChatsTopSectionProps {
  isMobileScreen: boolean;
}

const ChatsTopSection: FC<ChatsTopSectionProps> = ({ isMobileScreen }) => {
  const { avatar } = useAuth();
  const ComponentTag = isMobileScreen ? 'section' : 'div';

  return (
    <ComponentTag className={styles['chats-top-section']}>
      <div className="container">
        <div className={styles['chats-top-section__content']}>
          <AvatarImage AvatarImg={avatar!} />
          <h1 className={styles['chats-top-section__title']}>Online Chat</h1>
          <PencilBtn isMobileScreen={isMobileScreen} />
        </div>
      </div>
    </ComponentTag>
  );
};

export default ChatsTopSection;
