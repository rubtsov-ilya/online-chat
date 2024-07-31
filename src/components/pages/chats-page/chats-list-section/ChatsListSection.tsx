import { FC } from "react"
import styles from './ChatsListSection.module.scss'
import EmptyChatsWrapper from "./empty-chats-wrapper/EmptyChatsWrapper"
import Search from "src/components/ui/search/Search"

const ChatsListSection: FC = () => {
  const chatsData = [{}]

  return (
    <section className={styles["chats-list-section"]}>
    <div className={`container container--height container--no-padding`}>
      <div className={styles["chats-list-section__content"]}>
        {chatsData.length === 0 && 
            <EmptyChatsWrapper />
        }

        {chatsData.length !== 0 && 
        <>
          <Search />
        </>

        }
      </div>
    </div>
  </section>
  )
}

export default ChatsListSection