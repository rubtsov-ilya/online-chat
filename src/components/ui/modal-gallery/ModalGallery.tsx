import { createPortal } from 'react-dom';
import { FC, useEffect, useState } from 'react';

/* import CrossSvg from '../../../assets/images/home-page-icons/cross.svg?react'; */

import styles from './ModalGallery.module.scss';

interface ModalGalleryProps {
  toggleModal: (timer?: number) => void;
  media: string[];
}

const ModalGallery: FC<ModalGalleryProps> = ({
  toggleModal,
  media,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
  }, []);

  const closeModal = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    if ((e as React.MouseEvent).type === 'click') {
      setIsVisible(false);
      toggleModal(150);
      /* длительность transition opacity в modal-gallery--visible */
    }
  };

  return createPortal(
    <div
      className={`${styles['modal-gallery']} ${isVisible ? styles['modal-gallery--visible'] : ''}`}
      onClick={closeModal}
    >
      <div
        className={styles['modal-gallery__content']}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <button
          className={styles['modal-gallery__close-btn']}
          onClick={closeModal}
        >
          {/* <CrossSvg className={styles['modal-gallery__close-icon']} /> */}X
        </button>
        <h1 className={styles['modal-gallery__title']}>
          Política de Privacidade
        </h1>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>
            Coleta de Informações:
          </span>{' '}
          Nosso site coleta apenas as informações necessárias para processar
          seus pedidos, incluindo seu nome, endereço, informações de contato e
          informações do cartão de crédito.
        </p>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>
            Uso das Informações:
          </span>{' '}
          Usamos suas informações apenas para processar seus pedidos, fornecer
          serviços, melhorar nosso site e informá-lo sobre novos produtos ou
          ofertas.
        </p>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>
            Confidencialidade:
          </span>{' '}
          Suas informações são estritamente confidenciais e não serão vendidas,
          trocadas, transferidas ou divulgadas de qualquer outra forma a
          terceiros, exceto quando necessário para cumprir seus pedidos ou
          quando exigido pela lei.
        </p>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>Segurança:</span>{' '}
          Tomamos todas as medidas de segurança necessárias para proteger suas
          informações contra acesso, uso ou divulgação não autorizados.
        </p>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>Cookies:</span>{' '}
          Nosso site utiliza cookies para melhorar sua experiência de usuário.
          Você pode desativar os cookies nas configurações do seu navegador, mas
          isso pode afetar a funcionalidade do site.
        </p>
        <p className={styles['modal-gallery__text']}>
          <span className={styles['modal-gallery__text-span']}>
            Alterações na Política de Privacidade:
          </span>{' '}
          Quaisquer alterações em nossa política de privacidade serão publicadas
          nesta página.
        </p>
      </div>
    </div>,
    document.getElementById('modal-gallery') as HTMLDivElement,
  );
};

export default ModalGallery;
