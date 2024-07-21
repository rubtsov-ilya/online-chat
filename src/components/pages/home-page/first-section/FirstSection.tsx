import styles from "./FirstSection.module.scss";
import LeftWrapper from "./left-wrapper/LeftWrapper";
import cupImg from '../../../../assets/images/cup-img.png'
import { FC } from "react";

const FirstSection: FC = () => {
  return (
    <section className={styles["first-section"]}>
      <div className="container">
        <div className={styles["first-section__content"]}>
          <LeftWrapper />
          <img className={styles["first-section__cup-img"]} src={cupImg} alt="Image" />
        </div>
      </div>
    </section>
  )
}

export default FirstSection