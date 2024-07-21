import { FC } from 'react'
import ProductCounter from '../product-counter/ProductCounter'
import Remover from '../remover/Remover'
import styles from './CartCard.module.sass'

interface CartCardProps {
  cartItem: IShopApiDataItem;
  cart: IShopApiDataItem[]
}

const OrderCard: FC<CartCardProps> = ({ cartItem, cart }) => {
  /*cartItem have: id, title, subtitle, price, count, img, currency */
  return (
    <>
      <div className={styles["cart-card"]}>
        <div className={styles["cart-card__general-wrapper"]}>
          <img className={styles["cart-card__img"]} src={cartItem.img} alt="Coffee" />
          <div className={styles["cart-card__name-wrapper"]}>
            <p className={styles["cart-card__name"]}>{cartItem.title}</p>
            <div className={styles["cart-card__components-wrapper"]}>
              <ProductCounter cart={cart} smallModifier={true} cardState={cartItem}/>
              <Remover cart={cart} cardState={cartItem}/>
            </div>
          </div>
        </div>
        <p className={styles["cart-card__price"]}>{cartItem.currency} {(parseFloat(cartItem.price?.replace(",", ".")) * cartItem.count).toFixed(2).replace(/\./, ',')}</p>
      </div>
      <hr className={styles["cart-card__stroke"]}></hr>
    </>
  )
}
export default OrderCard