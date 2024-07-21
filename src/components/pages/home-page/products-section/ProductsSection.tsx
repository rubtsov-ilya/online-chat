import styles from "./ProductsSection.module.sass";
import ProductCard from "../../../ui/product-card/ProductCard";
import { useGetProductsQuery, useGetUserStateQuery } from "../../../../redux/index";
import CustomSelect from "./custom-select/CustomSelect";
import { FC, useState } from "react";
import SearchFilter from "./search-filter/SearchFilter";
import { SortParams } from "../../../../interfaces/SortParams.interface";
import useAuth from "../../../../hooks/useAuth";



type ErrorStatusType = number | "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR" | "CUSTOM_ERROR" | undefined

const productsSection: FC = () => {
  /* Auth test*/
  const {email, isAuth, uid, uMockid} = useAuth()
  console.log(email, isAuth, uid, uMockid)
  /* select state */
  const [sortParams, setSortParams] = useState<SortParams>({
    sortBy: 'title',
    order: 'asc'
  });
  /* search state*/
  const [searchParameter, setSearchParameter] = useState<string>('');
  /* data query */
  const { data: products = [], isLoading, error, isFetching } = useGetProductsQuery({ sortBy: sortParams.sortBy, order: sortParams.order, title: searchParameter });
  const { data: userData = null, isLoading: isUserDateLoading } = useGetUserStateQuery({ uMockid: uMockid! }, { skip: uMockid === null })

  const errorStatus: ErrorStatusType = error && 'status' in error ? error.status : undefined;

  return (
    <section className={styles["products-section"]}>
      <div className="container">
        <div className={styles["products-section__content"]}>
          <h2 className={styles["products-section__title"]}>Nossos cafés</h2>

          <div className={styles["products-section__filters-wrapper"]}>
            <SearchFilter setSearchParameter={setSearchParameter}/>
            <CustomSelect setSortParams={setSortParams} />
          </div>
          
          <div className={styles["products-section__grid"]}>
            {/* server states */}
            {isLoading && (
              <p className={styles["products-section__loading"]}>
                {"Loading".split("").map((letter, index) => (
                  <span key={index}>{letter}</span>
                ))}
              </p>
            )}
            {errorStatus === 'PARSING_ERROR' && (
              <p className={styles["products-section__error"]}>Error</p>
            )}

            {errorStatus === 404 && (
              <p className={styles["products-section__error"]}>Não há nada para "{searchParameter}"</p>
            )}
            {/* cards */}
            {!errorStatus && !isFetching && products.map((product) => {
              return (
                <ProductCard isUserDateLoading={isUserDateLoading} uMockid={uMockid} key={product.id} product={product} cart={userData?.cart} />
              );
            })}
          </div>

          {/* underline */}
          {!isLoading && !error && !isFetching && 
            <div className={styles["products-section__underline"]}></div>
          }
        </div>
      </div>
    </section>
  );
};

export default productsSection;
