import { FC } from 'react'
import styles from './ChatFooter.module.scss'

interface ChatFooterProps {
  isMobileScreen?: boolean;
}

const ChatFooter: FC<ChatFooterProps> = ({isMobileScreen}) => {
  const ComponentTag = isMobileScreen ? "footer" : "div";
  return (
    <ComponentTag className={styles["bottom-bar"]}>
    <div className={isMobileScreen ? `container` : `container container--max-width-unset`}>
      <div className={styles["bottom-bar__content"]}>
        <h1 className={styles["bottom-bar__title"]}>Online Chat</h1>
      </div>
    </div>
  </ComponentTag>
  )
}

export default ChatFooter