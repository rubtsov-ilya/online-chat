import { createPortal } from 'react-dom'
import styles from './PolicyModal.module.sass'
import { FC, useEffect, useRef } from 'react'
import useBodyLock from '../../../hooks/useBodyLock'
import CrossSvg from '../../../assets/images/home-page-icons/cross.svg?react'

interface PolicyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PolicyModal: FC<PolicyModalProps> = ({ isOpen, setIsOpen }) => {
  const policyRef = useRef<HTMLDialogElement>(null)
  const { toggleBodyLock } = useBodyLock()

  useEffect(() => {
    if (isOpen) {
      policyRef.current?.showModal()
    } else {
      policyRef.current?.close()
    }
  }, [isOpen])
  
  const handleCloseBtnClick = () => { 
    setIsOpen((prev) => !prev)
    toggleBodyLock()
   }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>): void => { 
    if (e.target === policyRef.current) {
      setIsOpen((prev) => !prev)
      toggleBodyLock()
    }
   }
   
  const handleEscKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => { 
    if (e.key === "Escape") {
      setIsOpen((prev) => !prev)
      toggleBodyLock()
    }
   }

  return createPortal (
    <dialog className={styles["policy"]} onKeyDown={handleEscKeyDown} onClick={handleBackdropClick} ref={policyRef}>
      <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className={styles["policy__wrapper"]}>
        <button className={styles["policy__close-btn"]} onClick={handleCloseBtnClick}>
          <CrossSvg className={styles["policy__close-icon"]}/>
        </button>
        <h1 className={styles["policy__title"]}>Política de Privacidade</h1>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Coleta de Informações:</span> Nosso site coleta apenas as informações necessárias para processar seus pedidos, incluindo seu nome, endereço, informações de contato e informações do cartão de crédito.</p>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Uso das Informações:</span> Usamos suas informações apenas para processar seus pedidos, fornecer serviços, melhorar nosso site e informá-lo sobre novos produtos ou ofertas.</p>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Confidencialidade:</span> Suas informações são estritamente confidenciais e não serão vendidas, trocadas, transferidas ou divulgadas de qualquer outra forma a terceiros, exceto quando necessário para cumprir seus pedidos ou quando exigido pela lei.</p>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Segurança:</span> Tomamos todas as medidas de segurança necessárias para proteger suas informações contra acesso, uso ou divulgação não autorizados.</p>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Cookies:</span> Nosso site utiliza cookies para melhorar sua experiência de usuário. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
        <p className={styles["policy__text"]}><span className={styles["policy__text-span"]}>Alterações na Política de Privacidade:</span> Quaisquer alterações em nossa política de privacidade serão publicadas nesta página.</p>
      </div>
    </dialog>,
    document.getElementById('policy-modal') as HTMLDivElement
  )
}

export default PolicyModal