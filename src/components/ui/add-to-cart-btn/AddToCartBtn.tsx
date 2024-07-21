import styles from './AddToCartBtn.module.sass'
import cartSvg from '../../../assets/images/home-page-icons/ShoppingCartSimple.svg'
import { FC } from 'react'


interface AddToCartBtnProps {
  onClick: () => Promise<void>;
  isAddToCartLoading: boolean;
}

const AddToCartBtn: FC<AddToCartBtnProps> = ({ onClick, isAddToCartLoading }) => {
  return (
    <button disabled={isAddToCartLoading} onClick={onClick} className={styles["add-to-cart-btn"]}>
      <img className={styles["add-to-cart-btn__icon"]} src={cartSvg} alt="Cart" />
    </button>
  )
}

export default AddToCartBtn