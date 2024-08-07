import { FC } from "react"
import ChatsHeader from 'src/components/pages/chats-page/chats-header/ChatsHeader'
import ChatsListSection from "src/components/pages/chats-page/chats-list-section/ChatsListSection"
import styles from './ChatsPage.module.scss'
import { useMediaQuery } from "react-responsive"
import { Outlet, useLocation } from "react-router-dom"
import ChatsDefaultSection from "./chats-default-section/ChatsDefaultSection"

const ChatsPage: FC = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 991px)'})
  const location = useLocation();
  const isChatPathName = location.pathname === '/chats/chat';

  return (
    <main className={styles["main"]}>
      {!isMobileScreen && 
      <>
        <section className={styles["chats-section"]}>
          <ChatsHeader isMobileScreen={isMobileScreen}/>
          <ChatsListSection isMobileScreen={isMobileScreen}/>
        </section>
        {isChatPathName && <Outlet />}
        {!isChatPathName && <ChatsDefaultSection />}
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