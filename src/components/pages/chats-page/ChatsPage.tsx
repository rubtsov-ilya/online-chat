import { FC } from "react"
import ChatsHeader from 'src/components/pages/chats-page/chats-header/ChatsHeader'
import ChatsListSection from "src/components/pages/chats-page/chats-list-section/ChatsListSection"
import styles from './ChatsPage.module.scss'

const ChatsPage: FC = () => {
  return (
    <main className={styles["main"]}>
      <ChatsHeader />
      <ChatsListSection />
    </main>
  )
}

export default ChatsPage