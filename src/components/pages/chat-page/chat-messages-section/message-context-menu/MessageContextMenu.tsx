import { FC, useEffect, useRef, useState } from 'react';
import styles from './MessageContextMenu.module.scss';
import CopySvg from 'src/assets/images/icons/24x24-icons/Copy.svg?react';
import ThreadSvg from 'src/assets/images/icons/24x24-icons/Thread Reply.svg?react';
import DeleteSvg from 'src/assets/images/icons/24x24-icons/Delete.svg?react';
import MessageContextMenuButton from '../message-context-menu-button/MessageContextMenuButton';
import { useDispatch } from 'react-redux';
import { addSelectedMessage } from 'src/redux/slices/SelectedMessagesSlice';
import useActiveChat from 'src/hooks/useActiveChat';

interface MessageContextMenuProps {
  messageText: string;
  сontextMenuActive: {
    positionY: number;
    positionX: number;
    backdropHeight: number;
    backdropWidth: number;
    isActive: boolean;
  };
  isMenuVisible: boolean;
  selectingMessageData: { messageId: string; messageDateUTC: number };
  setModalOpen: (value: React.SetStateAction<false | 'delete'>) => void;
  closeContextMenu: () => void;
}

const MessageContextMenu: FC<MessageContextMenuProps> = ({
  messageText,
  сontextMenuActive,
  isMenuVisible,
  selectingMessageData,
  closeContextMenu,
  setModalOpen,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuSize, setMenuSize] = useState({ width: 0, height: 0 });
  const dispatch = useDispatch();
  const { activeChatId } = useActiveChat();

  useEffect(() => {
    if (menuRef.current) {
      const { clientWidth, clientHeight } = menuRef.current;
      setMenuSize({ width: clientWidth + 2, height: clientHeight + 2 }); // 2px чтобы избежать бага появления скроллбара на всей страницы в редких случаях
    }
  }, [isMenuVisible]);

  const isWidthEnough =
    сontextMenuActive.backdropWidth - сontextMenuActive.positionX >
    menuSize.width;
  const isHeightEnough =
    сontextMenuActive.backdropHeight - сontextMenuActive.positionY >
    menuSize.height;

  const onCopyBtnClick = (text: string) => {
    navigator.clipboard.writeText(text); // копируется текст в буфер обмена
    closeContextMenu();
  };

  const onDeleteBtnClick = () => {
    closeContextMenu();
    setModalOpen('delete');
  };

  const onSelectMessageClick = () => {
    if (activeChatId === null) {
      return;
    }
    const messageDateTimestamp = new Date(
      selectingMessageData.messageDateUTC,
    ).getTime(); // selectingMessageData.messageDateUTC в виде строки
    dispatch(
      addSelectedMessage({
        selectedMessage: {
          messageId: selectingMessageData.messageId,
          messageDateUTC: messageDateTimestamp,
        },
        selectedChatId: activeChatId,
      }),
    );
    closeContextMenu();
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
        <MessageContextMenuButton
          text="Копировать текст"
          Svg={CopySvg}
          onClick={() => onCopyBtnClick(messageText)}
        />
      )}

      {/* кнопка выбрать */}
      <MessageContextMenuButton
        text="Выбрать"
        Svg={ThreadSvg}
        onClick={onSelectMessageClick}
      />

      {/* кнопка удалить */}
      <MessageContextMenuButton
        text="Удалить"
        Svg={DeleteSvg}
        onClick={onDeleteBtnClick}
        accentColor="red"
      />
    </div>
  );
};

export default MessageContextMenu;
