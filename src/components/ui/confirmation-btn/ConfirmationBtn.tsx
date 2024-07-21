import { FC } from 'react'
import styles from './ConfirmationBtn.module.sass'

interface ConfirmationBtnProps {
  doFormSubmit: () => void
}

const ConfirmationBtn: FC<ConfirmationBtnProps> = ({ doFormSubmit }) => {
  return (
    <button onClick={doFormSubmit} className={styles["confirmation-btn"]}>confirmar pedido</button>
  )
}

export default ConfirmationBtn