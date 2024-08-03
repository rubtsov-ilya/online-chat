import { FC } from 'react'
import styles from './ChatHeader.module.scss'

interface ChatHeaderProps {
  isMobileScreen?: boolean;
}

const ChatHeader: FC<ChatHeaderProps> = ({isMobileScreen}) => {
  const ComponentTag = isMobileScreen ? "header" : "div";

  return (
    <ComponentTag className={styles["top-bar"]}>
      <div className={isMobileScreen ? `container` : `container container--max-width-unset`}>
        <div className={styles["top-bar__content"]}>
          <h1 className={styles["top-bar__title"]}>Online Chat</h1>
        </div>
      </div>
    </ComponentTag>
  );
}

export default ChatHeader

