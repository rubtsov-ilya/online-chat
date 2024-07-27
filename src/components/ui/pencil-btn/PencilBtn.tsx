import { FC } from 'react'
import styles from './PencilBtn.module.scss'
import PencilSvg from 'src/assets/images/icons/24x24-icons/Pencil New.svg?react'
import useBodyLock from 'src/hooks/useBodyLock'

const PencilBtn: FC = () => {
  const {isBodyLock, lockPaddingValue, toggleBodyLock} = useBodyLock()

  return (
    <div /* onClick={} */ className={styles["btn"]}>
      <PencilSvg className={styles["btn__svg"]}/>
    </div>
  )
}

export default PencilBtn