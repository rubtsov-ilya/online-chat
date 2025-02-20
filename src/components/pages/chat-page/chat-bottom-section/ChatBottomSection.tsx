import { FC, useEffect, useState } from 'react';

import styles from './ChatBottomSection.module.scss';
import MessageInputWrapper from './message-input-wrapper/MessageInputWrapper';
import AttachedContentWrapper from './attached-content-wrapper/AttachedContentWrapper';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';
import { IUploadTasksRef } from 'src/interfaces/UploadTasks.interface';
import DragNDropZone from './drag-n-drop-zone/DragNDropZone';
import { ILocationChatPage } from 'src/interfaces/LocationChatPage.interface';
import useChatInputValues from 'src/hooks/useChatInputValues';
import { useDispatch } from 'react-redux';
import {
  ChatInputValue,
  addChatInputValue,
  updateChatInputValue,
} from 'src/redux/slices/ChatInputValues';

interface ChatBottomSectionProps {
  activeChatId: string | null;
  isSubscribeLoading: boolean;
  isMobileScreen: boolean;
  uploadTasksRef: React.MutableRefObject<IUploadTasksRef>;
  isDrag: boolean; 
  locationState: ILocationChatPage | null;
  setIsDrag: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBottomSection: FC<ChatBottomSectionProps> = ({
  activeChatId,
  isSubscribeLoading,
  isMobileScreen,
  uploadTasksRef,
  isDrag,
  locationState,
  setIsDrag,
}) => {
  const ComponentTag = isMobileScreen ? 'section' : 'div';
  const dispatch = useDispatch();
  const { chatInputValues } = useChatInputValues();

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
    <ComponentTag className={styles['chat-bottom-section']} id='chat-bottom-section'>
      <div
        className={
          isMobileScreen ? 'container' : 'container container--max-width-unset'
        }
      >
        <div className={styles['chat-bottom-section__content']}>
          {attachedItems.length > 0 && (
            <AttachedContentWrapper
              activeChatId={activeChatId}
              attachedItems={attachedItems}
            />
          )}
          <MessageInputWrapper
            chatInputValues={chatInputValues}
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

export default ChatBottomSection;
