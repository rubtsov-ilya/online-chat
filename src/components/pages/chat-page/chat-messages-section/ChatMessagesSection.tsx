import { FC } from 'react'
import styles from './ChatMessagesSection.module.scss'

interface ChatMessagesSectionProps {
  isMobileScreen?: boolean;
}

const ChatMessagesSection: FC<ChatMessagesSectionProps> = ({isMobileScreen}) => {
  const ComponentTag = isMobileScreen ? "section" : "div";

  return (
    <ComponentTag className={styles["chat-messages"]}>
    <div className={isMobileScreen ? `container container--height` : `container container--max-width-unset container--height`}>
      <div className={styles["chat-messages__content"]}>
        
      cock
      </div>
    </div>
  </ComponentTag>
  )
}

export default ChatMessagesSection