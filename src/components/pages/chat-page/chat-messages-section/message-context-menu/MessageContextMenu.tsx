import { FC, useRef } from 'react';
import styles from './MessageContextMenu.module.scss';
import CopySvg from 'src/assets/images/icons/24x24-icons/Copy.svg?react';
import ThreadSvg from 'src/assets/images/icons/24x24-icons/Thread Reply.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';

interface MessageContextMenuProps {
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
  сontextMenuActive,
  isMenuVisible,
  closeContextMenu,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonCount = 3; // число кнопок в меню
  const menuSize = {
    width: 264, // ширина в css у .message-context-menu
    height: 40 * buttonCount + 2, // первое число - высота в css у .message-context-menu__button, второе - кол-во кнопок, третье высота border с двух сторон
  };

  const isWidthEnough =
    сontextMenuActive.backdropWidth - сontextMenuActive.positionX >
    menuSize.width;
  const isHeightEnough =
    сontextMenuActive.backdropHeight - сontextMenuActive.positionY > menuSize.height;

  return (
    <div
      ref={menuRef}
      style={{
        top: isHeightEnough ? сontextMenuActive.positionY : сontextMenuActive.positionY - menuSize.height ,
        left: isWidthEnough ? сontextMenuActive.positionX : сontextMenuActive.positionX - menuSize.width,
        transformOrigin: `${isWidthEnough ? 'left' : 'right'} ${isHeightEnough ? 'top' : 'bottom'}`,
      }}
      className={`${styles['message-context-menu']} ${isMenuVisible ? styles['active'] : ''}`}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        e.stopPropagation()
      }
    >
      {/* кнопка копировать текст */}
      <button className={styles['message-context-menu__button']}>
        <CopySvg className={styles['message-context-menu__icon']} />
        <span className={styles['message-context-menu__text']}>
          Копировать текст
        </span>
      </button>

      {/* кнопка выбрать */}
      <button className={styles['message-context-menu__button']}>
        <ThreadSvg className={styles['message-context-menu__icon']} />
        <span className={styles['message-context-menu__text']}>Выбрать</span>
      </button>

      {/* кнопка удалить */}
      <button
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
