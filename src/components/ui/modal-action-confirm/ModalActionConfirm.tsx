import { createPortal } from 'react-dom';

import styles from './ModalActionConfirm.module.scss';
import { FC, useEffect, useState } from 'react';

interface ModalActionConfirmProps {
  toggleModal: (state: false | 'ban' | 'delete', timer?: number) => void;
}

const ModalActionConfirm: FC<ModalActionConfirmProps> = ({ toggleModal }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    toggleModal(false, 100);
    /* аргумент - длительность transition opacity в modal-gallery */
  };

  return createPortal(
    <div
      className={`${styles['modal-action-confirm']} ${isVisible ? styles['modal-action-confirm--visible'] : ''}`}
      onClick={closeModal}
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        modal
      </div>
    </div>,
    document.getElementById('modal-action-confirm') as HTMLDivElement,
  );
};

export default ModalActionConfirm;
