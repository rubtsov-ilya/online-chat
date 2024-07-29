import { FC } from "react"
import styles from './ChatsListSection.module.scss'
import useBodyLock from "src/hooks/useBodyLock"
import EmptyChatsWrapper from "./empty-chats-wrapper/EmptyChatsWrapper"
import Search from "src/components/ui/search/Search"

const ChatsListSection: FC = () => {
  const { isBodyLock, lockPaddingValue } = useBodyLock()
  const chatsData = [{}]

  return (
    <section style={ isBodyLock ? { paddingRight: `${lockPaddingValue}px` } : {}} className={styles["chats-list-section"]}>
    <div className={`container container--height`}>
      <div className={styles["chats-list-section__content"]}>
        {chatsData.length === 0 && 
            <EmptyChatsWrapper />
        }

        {chatsData.length !== 0 && 
          <Search />
        }
      </div>
    </div>
  </section>
  )
}

export default ChatsListSection