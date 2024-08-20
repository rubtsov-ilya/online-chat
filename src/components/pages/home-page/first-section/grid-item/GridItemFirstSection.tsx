import { FC } from 'react';

import styles from './GridItemFirstSection.module.scss';

interface GridItemFirstSectionProps {
  svgIcon: string;
  children: React.ReactNode;
}

const GridItemFirstSection: FC<GridItemFirstSectionProps> = ({
  svgIcon,
  children,
}) => {
  return (
    <div className={styles['grid-item']}>
      <img className={styles['grid-item__svg']} src={svgIcon} alt="Icon" />
      <p className={styles['grid-item__text']}>{children}</p>
    </div>
  );
};

export default GridItemFirstSection;
