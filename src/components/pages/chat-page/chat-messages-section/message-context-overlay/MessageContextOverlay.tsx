import { FC, useEffect, useLayoutEffect, useState } from 'react';
import styles from './MessageContextOverlay.module.scss';
import { createPortal } from 'react-dom';
import MessageContextMenu from '../message-context-menu/MessageContextMenu';

interface MessageContextOverlayProps {
  setContextMenuActive: React.Dispatch<
    React.SetStateAction<{
      positionY: number;
      positionX: number;
      overlayHeight: number;
      overlayWidth: number;
      isActive: boolean;
    }>
  >;
  сontextMenuActive: {
    positionY: number;
    positionX: number;
    overlayHeight: number;
    overlayWidth: number;
    isActive: boolean;
  };
}

const MessageContextOverlay: FC<MessageContextOverlayProps> = ({
  setContextMenuActive,
  сontextMenuActive,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMenuVisible(true);
    }, 10);
  }, [сontextMenuActive.isActive]);

  const closeContextMenu = () => {
    setIsMenuVisible(false);
    setTimeout(() => {
      setContextMenuActive({
        positionY: 0,
        positionX: 0,
        overlayHeight: 0,
        overlayWidth: 0,
        isActive: false,
      });
    }, 150); // 150ms длительность анимации в .message-context-menu transition
  };

  return createPortal(
    <div
      onClick={closeContextMenu}
      onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
      }}
      className={styles['message-context-overlay']}
    >
      <MessageContextMenu
        closeContextMenu={closeContextMenu}
        isMenuVisible={isMenuVisible}
        сontextMenuActive={сontextMenuActive}
      />
    </div>,
    document.getElementById('message-context-overlay') as HTMLDivElement, // находится в ChatPage
  );
};

export default MessageContextOverlay;
