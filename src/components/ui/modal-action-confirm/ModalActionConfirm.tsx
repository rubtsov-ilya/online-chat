import { FC } from 'react';
import styles from './modalActionConfirm.module.scss';
import AvatarImage from '../avatar-image/AvatarImage';

interface ModalActionConfirmProps {
  avatar?: string;
  title?: string;
  subtitle: string;
  actionBtnText: string;
  isMobileScreen: boolean;
  action: () => void;
  closeModal?: () => void;
  /* closeModal !== undefined, передаётся из ModalBackdrop через 
  React.cloneElement(children as... Поэтому указан проп как необязательный */
  /* const closeModal = () => {
    setIsVisible(false);
    toggleModal();
  }; */
}

const ModalActionConfirm: FC<ModalActionConfirmProps> = ({
  title,
  subtitle,
  actionBtnText,
  avatar,
  isMobileScreen,
  action,
  closeModal,
}) => {
  return (
    <div
      className={styles['modal-action-confirm']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      onContextMenu={(e) => {
        if (isMobileScreen) {
          e.preventDefault();
        }
      }}
    >
      {(avatar !== undefined || title !== undefined) && (
        <div className={styles['modal-action-confirm__info-wrapper']}>
          {avatar !== undefined && (
            <AvatarImage isLittle={true} AvatarImg={avatar} />
          )}
          {title !== undefined && (
            <span className={styles['modal-action-confirm__title']}>
              {title}
            </span>
          )}
        </div>
      )}

      <span className={styles['modal-action-confirm__subtitle']}>{subtitle}</span>
      <div className={styles['modal-action-confirm__buttons-wrapper']}>
        <button
          className={styles['modal-action-confirm__action-btn']}
          onClick={() => {
            action();
            closeModal!();
          }}
        >
          {actionBtnText}
        </button>
        <button
          className={styles['modal-action-confirm__cancel-btn']}
          onClick={closeModal!}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalActionConfirm;
