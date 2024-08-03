import { FC } from 'react'
import styles from './ChatPage.module.scss'
import ChatFooter from './chat-footer/ChatFooter'
import ChatHeader from './chat-header/ChatHeader'
import ChatMessagesSection from './chat-messages-section/ChatMessagesSection'
import { useMediaQuery } from 'react-responsive'

const ChatPage: FC = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)'})
  const ComponentTag = isMobileScreen ? "main" : "section";

  return (
    <ComponentTag className={styles["main"]}>
      <ChatHeader isMobileScreen={isMobileScreen}/>
      <ChatMessagesSection isMobileScreen={isMobileScreen}/>
      <ChatFooter isMobileScreen={isMobileScreen}/>
    </ComponentTag>
  )
}

export default ChatPage