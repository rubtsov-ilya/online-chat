import { FC, useEffect, useState } from 'react';
import styles from './ModalInputConfirm.module.scss';
import AvatarImage from '../avatar-image/AvatarImage';

interface ModalInputConfirmProps {
  avatar?: string;
  title?: string;
  subtitle?: string;
  actionBtnText: string;
  isMobileScreen: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  widthStyle?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  action: () => void;
  closeModal?: () => void;
  validateInput?: (value: string) => string;
  /* closeModal !== undefined, передаётся из ModalBackdrop через 
  React.cloneElement(children as... Поэтому указан проп как необязательный */
  /* const closeModal = () => {
    setIsVisible(false);
    toggleModal();
  }; */
}

const ModalInputConfirm: FC<ModalInputConfirmProps> = ({
  title,
  subtitle,
  actionBtnText,
  avatar,
  isMobileScreen,
  inputPlaceholder,
  setInputValue,
  inputValue,
  action,
  closeModal,
  widthStyle,
  validateInput,
}) => {
  const [inputError, setInputError] = useState<string>('');

  const onActionBtnClick = () => {
    if (setInputValue !== undefined && inputValue !== undefined) {
      if (validateInput) {
        /* проверка условий */
        const error = validateInput(inputValue);
        if (error) {
          setInputError(error);
          return;
        }
      }
      action();
      closeModal!();
    }
  };

  useEffect(() => {
    return () => {
      setInputError('');
    };
  }, []);

  return (
    <div
      className={styles['modal-input-confirm']}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      onContextMenu={(e) => {
        if (isMobileScreen) {
          e.preventDefault();
        }
      }}
      style={{ width: widthStyle ? widthStyle : '' }}
    >
      {(avatar !== undefined || title !== undefined) && (
        <div className={styles['modal-input-confirm__info-wrapper']}>
          {avatar && (
            <AvatarImage isLittle={true} AvatarImg={avatar} />
          )}
          {title && (
            <span className={styles['modal-input-confirm__title']}>
              {title}
            </span>
          )}
        </div>
      )}

      {subtitle && (
        <p className={styles['modal-input-confirm__subtitle']}>{subtitle}</p>
      )}

      {inputError && (
        <label
          htmlFor="inputField"
          className={styles['modal-input-confirm__label-error']}
        >
          {inputError}
        </label>
      )}

      {inputPlaceholder !== undefined &&
        setInputValue !== undefined &&
        inputValue !== undefined && (
          <input
            value={inputValue}
            type="text"
            autoComplete="off"
            id="inputField"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
            placeholder={inputPlaceholder}
            className={styles['modal-input-confirm__input']}
          />
        )}

      <div className={styles['modal-input-confirm__buttons-wrapper']}>
        <button
          className={styles['modal-input-confirm__action-btn']}
          onClick={onActionBtnClick}
        >
          {actionBtnText}
        </button>
        <button
          className={styles['modal-input-confirm__cancel-btn']}
          onClick={closeModal!}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalInputConfirm;
