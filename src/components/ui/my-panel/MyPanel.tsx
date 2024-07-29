import styles from './MyPanel.module.scss'
import useBodyLock from 'src/hooks/useBodyLock'
import { FC } from 'react'
import { createPortal } from 'react-dom';

interface MyPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyPanel: FC<MyPanelProps> = ({ isPanelOpen, setIsPanelOpen }) => {
  const { toggleBodyLock } = useBodyLock()
  
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => { 
    setIsPanelOpen((prev) => !prev);
    toggleBodyLock();
   }

   const onEscKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => { 
    if (e.key === "Esc") {
      setIsPanelOpen((prev) => !prev)
      toggleBodyLock()
    }
   }

  return createPortal(
  <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className={styles["stop-propagation-wrapper"]}>
    <div onClick={onBackdropClick} className={isPanelOpen ? `${styles["my-panel-backdrop"]} ${styles["active"]}` : styles["my-panel-backdrop"]}>
      <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className={styles["my-panel"]}>
        <h1>test</h1>
      </div>
    </div>
  </div>, document.getElementById('my-panel') as HTMLDivElement
  )
  
}

export default MyPanel