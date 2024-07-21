import styles from "./ProductCard.module.sass";
import { usePutCartMutation } from "../../../redux";
import AddToCartBtn from "../add-to-cart-btn/AddToCartBtn.jsx";
import LinkToCartBtn from "../link-to-cart-btn/LinkToCartBtn.jsx";
import ProductCounter from "../product-counter/ProductCounter.jsx";
import { FC, useEffect } from "react";
import useServerError from "../../../hooks/useServerError.js";
import { IValueServerError } from "../../../interfaces/ServerErrorValue.interface.js";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  cart: IShopApiDataItem[] | undefined;
  product: IShopApiDataItem;
  uMockid: string | null;
  isUserDateLoading: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ cart, product, uMockid, isUserDateLoading }) => {
  const navigate = useNavigate();
  /*product have: id, title, subtitle, price, count, img, currency */
  const [putCart, {isLoading: isPutCartLoading, isError: isPutCartError}] = usePutCartMutation()
  const {isTooManyRequestsError, setServerError}: IValueServerError = useServerError()
  useEffect(() => {
    if (isPutCartError) {
      setServerError();
    }
  }, [isPutCartError])

  const cardState = cart?.find((item) => { return item.id === product.id})


  async function addProduct(product: IShopApiDataItem): Promise<void> {
    if (cart && uMockid) {
      if (isTooManyRequestsError) {
        alert('Too many requests to MockApi, await 20 seconds');
        return
      }
      if (isPutCartLoading || isUserDateLoading) {
        return
      }
      const newCartArray = [...cart, product]
      await putCart({newCartArray: newCartArray, uMockid: uMockid}).unwrap()
    } else {
      navigate( '/login' )
    }
  }

  return (
    <div className={styles["product-card"]}>
      <div className={styles["product-card__image-wrapper"]}>
        <img
          className={styles["product-card__image"]}
          src={product.img}
          alt="Image"
        />
      </div>
      <p className={styles["product-card__title"]}>{product.title}</p>
      <p className={styles["product-card__subtitle"]}>{product.subtitle}</p>
      <div className={styles["product-card__bottom-wrapper"]}>
        <div className={styles["product-card__price-wrapper"]}>
          <p className={styles["product-card__price-currency"]}>
            {product.currency}
            <span className={styles["product-card__price"]}>
              {" "}
              {product.price}
            </span>
          </p>
        </div>
        {!cardState && <AddToCartBtn isAddToCartLoading={isPutCartLoading} onClick={() => addProduct(product)}/>}
        {cardState && cart && (
          <div className={styles["product-card__added-wrapper"]}>
            <ProductCounter cart={cart} cardState={cardState}/>
            <LinkToCartBtn />
          </div>
        )}

        {/* <button onClick={() => handleDeleteProduct(product.id)} className={styles["product-card__penis"]}>Penis</button> */}
      </div>
    </div>
  );
}

export default ProductCard