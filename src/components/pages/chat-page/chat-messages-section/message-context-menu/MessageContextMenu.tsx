import { FC, useEffect, useRef, useState } from 'react';
import styles from './MessageContextMenu.module.scss';
import CopySvg from 'src/assets/images/icons/24x24-icons/Copy.svg?react';
import ThreadSvg from 'src/assets/images/icons/24x24-icons/Thread Reply.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';


interface MessageContextMenuProps {
  setModalOpen: (value: React.SetStateAction<false | "delete">) => void
  messageText: string;
  сontextMenuActive: {
    positionY: number;
    positionX: number;
    backdropHeight: number;
    backdropWidth: number;
    isActive: boolean;
  };
  isMenuVisible: boolean;
  closeContextMenu: () => void;
}

const MessageContextMenu: FC<MessageContextMenuProps> = ({
  messageText,
  сontextMenuActive,
  isMenuVisible,
  closeContextMenu,
  setModalOpen,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (menuRef.current) {
      const { clientWidth, clientHeight } = menuRef.current;
      setMenuSize({ width: clientWidth + 2, height: clientHeight + 2}); // 2px чтобы избежать бага появления скроллбара на всей страницы в редких случаях
    }
  }, [isMenuVisible]);

  const isWidthEnough =
    сontextMenuActive.backdropWidth - сontextMenuActive.positionX >
    menuSize.width;
  const isHeightEnough =
    сontextMenuActive.backdropHeight - сontextMenuActive.positionY >
    menuSize.height;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text); // копируется текст в буфер обмена
      closeContextMenu();
    } catch (error) {
      console.error('Не удалось скопировать текст: ', error);
      closeContextMenu();
    }
  };

  const onDeleteButtonClick = () => {
    closeContextMenu();
    setModalOpen('delete');
  };

  return (
    <div
      ref={menuRef}
      style={{
        top: isHeightEnough
          ? сontextMenuActive.positionY
          : сontextMenuActive.positionY - menuSize.height,
        left: isWidthEnough
          ? сontextMenuActive.positionX
          : сontextMenuActive.positionX - menuSize.width,
        transformOrigin: `${isWidthEnough ? 'left' : 'right'} ${isHeightEnough ? 'top' : 'bottom'}`,
      }}
      className={`${styles['message-context-menu']} ${isMenuVisible ? styles['active'] : ''}`}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        e.stopPropagation()
      }
    >
      {/* кнопка копировать текст */}
      {messageText && (
        <button
          onClick={() => copyText(messageText)}
          className={styles['message-context-menu__button']}
        >
          <CopySvg className={styles['message-context-menu__icon']} />
          <span className={styles['message-context-menu__text']}>
            Копировать текст
          </span>
        </button>
      )}

      {/* кнопка выбрать */}
      <button className={styles['message-context-menu__button']}>
        <ThreadSvg className={styles['message-context-menu__icon']} />
        <span className={styles['message-context-menu__text']}>Выбрать</span>
      </button>

      {/* кнопка удалить */}
      <button
        onClick={onDeleteButtonClick}
        className={`${styles['message-context-menu__button']} ${styles['red']}`}
      >
        <DeleteSvg
          className={`${styles['message-context-menu__icon']} ${styles['red']}`}
        />
        <span
          className={`${styles['message-context-menu__text']} ${styles['red']}`}
        >
          Удалить
        </span>
      </button>
    </div>
  );
};

export default MessageContextMenu;
