import { createPortal } from 'react-dom';

import styles from './ModalBackdrop.module.scss';
import React, { FC, useEffect, useState } from 'react';

interface ModalBackdropProps {
  children: React.ReactNode;
  toggleModal: () => void;
  divIdFromIndexHtml: string;
}

const ModalBackdrop: FC<ModalBackdropProps> = ({
  children,
  toggleModal,
  divIdFromIndexHtml,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    toggleModal();
    /* аргумент - длительность transition opacity в modal-backdrop */
  };

  return createPortal(
    <div
      className={`${styles['modal-backdrop']} ${isVisible ? styles['modal-backdrop--visible'] : ''}`}
      onClick={closeModal}
    >
      {React.cloneElement(children as React.ReactElement, {
        closeModal: () => closeModal(),
      })}
    </div>,
    document.getElementById(divIdFromIndexHtml) as HTMLDivElement,
  );
};

export default ModalBackdrop;
