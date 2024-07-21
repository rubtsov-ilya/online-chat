import GridItemFirstSection from '../grid-item/GridItemFirstSection'
import styles from './LeftWrapper.module.sass'

import gridIcon1 from '../../../../../assets/images/home-page-icons/first-section-icon1.svg'
import gridIcon2 from '../../../../../assets/images/home-page-icons/first-section-icon2.svg'
import gridIcon3 from '../../../../../assets/images/home-page-icons/first-section-icon3.svg'
import gridIcon4 from '../../../../../assets/images/home-page-icons/first-section-icon4.svg'
import { FC } from 'react'

const LeftWrapper: FC = () => {
  return (
    <div className={styles["left-wrapper"]}>
      <h1 className={styles["left-wrapper__title"]}>Encontre o café perfeito para qualquer hora do dia</h1>
      <p className={styles["left-wrapper__subtitle"]}>Com o Coffee Delivery você recebe seu café onde estiver, a qualquer hora</p>
      <div className={styles["left-wrapper__grid-wrapper"]}>
        <GridItemFirstSection svgIcon={gridIcon1}>Compra simples e segura</GridItemFirstSection>
        <GridItemFirstSection svgIcon={gridIcon2}>Embalagem mantém o café intacto</GridItemFirstSection>
        <GridItemFirstSection svgIcon={gridIcon3}>Entrega rápida e rastreada</GridItemFirstSection>
        <GridItemFirstSection svgIcon={gridIcon4}>O café chega fresquinho até você</GridItemFirstSection>
      </div>
    </div>
  )
}

export default LeftWrapper