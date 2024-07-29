import { FC, useState } from 'react'
import styles from './PencilBtn.module.scss'
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react'
import MyPanel from '../my-panel/MyPanel'
import useBodyLock from 'src/hooks/useBodyLock'

const PencilBtn: FC = ({}) => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)
  const { toggleBodyLock } = useBodyLock()

  const onBtnClick = (): void => { 
    setIsPanelOpen((prev) => !prev);
    toggleBodyLock();
   }

  return (
    <div onClick={onBtnClick} className={styles["btn"]}>
      <PencilSvg className={styles["btn__svg"]}/>
      <MyPanel isPanelOpen={isPanelOpen} setIsPanelOpen={setIsPanelOpen}/>
    </div>
  )
}

export default PencilBtn