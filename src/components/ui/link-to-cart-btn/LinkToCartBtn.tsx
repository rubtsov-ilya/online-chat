import styles from './LinkToCartBtn.module.sass'
import cartSvg from '../../../assets/images/home-page-icons/ShoppingCartSimple.svg'
import { Link } from 'react-router-dom'
import { FC } from 'react'


const LinkToCartBtn: FC = () => {
  return (
    <Link to={"/cart"} className={styles["link-to-cart-btn"]}>
      <img className={styles["link-to-cart-btn__icon"]} src={cartSvg} alt="Cart" />
    </Link>
  )
}

export default LinkToCartBtn