import { FC, useEffect, useState } from 'react';
import styles from './MessageContextBackdrop.module.scss';
import { createPortal } from 'react-dom';
import MessageContextMenu from '../message-context-menu/MessageContextMenu';

interface MessageContextBackdropProps {
  setModalOpen: (value: React.SetStateAction<false | "delete">) => void
  messageText: string;
  setContextMenuActive: React.Dispatch<
    React.SetStateAction<{
      positionY: number;
      positionX: number;
      backdropHeight: number;
      backdropWidth: number;
      isActive: boolean;
    }>
  >;
  сontextMenuActive: {
    positionY: number;
    positionX: number;
    backdropHeight: number;
    backdropWidth: number;
    isActive: boolean;
  };
}

const MessageContextBackdrop: FC<MessageContextBackdropProps> = ({
  setModalOpen,
  messageText,
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
        backdropHeight: 0,
        backdropWidth: 0,
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
      className={styles['message-context-backdrop']}
    >
      <MessageContextMenu
        setModalOpen={(c) => setModalOpen(c)}
        messageText={messageText}
        closeContextMenu={closeContextMenu}
        isMenuVisible={isMenuVisible}
        сontextMenuActive={сontextMenuActive}
      />
    </div>,
    document.getElementById('message-context-backdrop') as HTMLDivElement, // находится в ChatPage
  );
};

export default MessageContextBackdrop;
