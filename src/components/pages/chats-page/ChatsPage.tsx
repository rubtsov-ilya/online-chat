import { FC } from "react"
import ChatsHeader from 'src/components/pages/chats-page/chats-header/ChatsHeader'
import ChatsListSection from "src/components/pages/chats-page/chats-list-section/ChatsListSection"
import styles from './ChatsPage.module.scss'
import { useMediaQuery } from "react-responsive"
import { Outlet } from "react-router-dom"

const ChatsPage: FC = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)'})
  const isChatSelected = true

  return (
    <main className={styles["main"]}>
      {!isMobileScreen && 
      <>
        <section className={styles["chats-section"]}>
          <ChatsHeader isMobileScreen={isMobileScreen}/>
          <ChatsListSection isMobileScreen={isMobileScreen}/>
        </section>
        {isChatSelected && <Outlet />}
        {!isChatSelected && <div>Test</div>}
      </>
      }

      {isMobileScreen && 
      <>
        <ChatsHeader />
        <ChatsListSection />
      </>
      }
    </main>
  )
}

export default ChatsPage