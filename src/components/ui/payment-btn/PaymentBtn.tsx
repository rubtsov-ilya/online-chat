import { FC } from 'react'
import styles from './PaymentBtn.module.sass'

interface PaymentBtnProps {
  Logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode
}
const PaymentBtn: FC<PaymentBtnProps> = ({ Logo, onClick, isActive, children }) => {

  return (
    <div onClick={onClick} className={ isActive ? `${styles["payment-btn"]} ${styles["active"]}` : `${styles["payment-btn"]}` }>
      <Logo className={styles["payment-btn__icon"]} width="17" height="17"/>
      <p className={styles["payment-btn__text"]}>{children}</p>
    </div>
  )
}

export default PaymentBtn