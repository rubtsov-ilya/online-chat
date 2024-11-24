import { FC } from 'react';
import styles from './modalActionConfirm.module.scss';

interface ModalActionConfirmProps {
  avatar?: string;
  title?: string;
  subtitle: string;
  actionBtnText: string;
  action: () => void;
  closeModal?: () => void;
}

const ModalActionConfirm: FC<ModalActionConfirmProps> = ({
  title,
  subtitle,
  actionBtnText,
  avatar,
  action,
  closeModal,
}) => {
  return (
    <div
      className={styles['modal-action-confirm']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {(avatar !== undefined || title !== undefined) && (
        <div className={styles['modal-action-confirm__info-wrapper']}>
          {avatar && (
            <img
              src={avatar}
              alt=""
              className={styles['modal-action-confirm__avatar']}
            />
          )}
          {title && (
            <span className={styles['modal-action-confirm__title']}>
              {title}
            </span>
          )}
        </div>
      )}

      <p className={styles['modal-action-confirm__subtitle']}>{subtitle}</p>
      <div className={styles['modal-action-confirm__buttons-wrapper']}>
        <button
          className={styles['modal-action-confirm__action-btn']}
          onClick={action}
        >
          {actionBtnText}
        </button>
        <button
          className={styles['modal-action-confirm__cancel-btn']}
          onClick={closeModal}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalActionConfirm;
