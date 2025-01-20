import { FC, useEffect, useState } from 'react';

import styles from './ChatFooter.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';
import AttachedContentWrapper from './attached-content-wrapper/AttachedContentWrapper';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import DragNDropZone from './drag-n-drop-zone/DragNDropZone';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import useGetChatInputValues from 'src/hooks/useGetChatInputValues';
import { useDispatch } from 'react-redux';
import {
  ChatInputValue,
  addChatInputValue,
  updateChatInputValue,
} from 'src/redux/slices/ChatInputValues';

interface ChatFooterProps {
  activeChatId: string | null;
  isSubscribeLoading: boolean;
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  isDrag: boolean;
  locationState: ILocationChatPage | null;
  setIsDrag: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatFooter: FC<ChatFooterProps> = ({
  activeChatId,
  isSubscribeLoading,
  isMobileScreen,
  uploadTasksRef,
  isDrag,
  locationState,
  setIsDrag,
}) => {
  const ComponentTag = isMobileScreen ? 'footer' : 'div';
  const dispatch = useDispatch();
  const { chatInputValues } = useGetChatInputValues();

  const updateAttachedItems = (state: AttachedItemType[]) => {
    dispatch(
      updateChatInputValue({
        chatId: activeChatId,
        attachedItems: state,
      }),
    );
  };

  const attachedItems =
    activeChatId !== null && chatInputValues[activeChatId] != null
      ? chatInputValues[activeChatId].attachedItems
      : chatInputValues['localeState'].attachedItems; // localeState - initialState if (chatId === null)

  return (
    <ComponentTag className={styles['chat-footer']}>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-footer__content']}>
          {attachedItems.length > 0 && (
            <AttachedContentWrapper
              activeChatId={activeChatId}
              attachedItems={attachedItems}
            />
          )}
          <MessageInputWrapper
            isSubscribeLoading={isSubscribeLoading}
            locationState={locationState}
            uploadTasksRef={uploadTasksRef}
            isMobileScreen={isMobileScreen}
            updateAttachedItems={updateAttachedItems}
            attachedItems={attachedItems}
          />
        </div>
      </div>
      {!isMobileScreen && (
        <DragNDropZone
          updateAttachedItems={updateAttachedItems}
          isDrag={isDrag}
          setIsDrag={setIsDrag}
        />
      )}
    </ComponentTag>
  );
};

export default ChatFooter;
