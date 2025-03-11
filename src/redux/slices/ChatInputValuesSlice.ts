import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttachedItemType } from 'src/interfaces/AttachedItem.interface';

export interface ChatInputValue {
  attachedItems: AttachedItemType[];
  messageText: string;
}

interface IInitialState {
  chatInputValues: {
    [chatId: string]: ChatInputValue;
  };
}

const initialState: IInitialState = {
  chatInputValues: {
    localeState: {
      attachedItems: [],
      messageText: '',
    },
  },
};

const chatInputValuesSlice = createSlice({
  name: 'chatInputValues',
  initialState,
  selectors: {
    selectChatInputValues: (state) => state,
  },
  reducers: {
    addChatInputValue: (
      state,
      action: PayloadAction<{
        chatId: string;
      }>,
    ) => {
      if (!state.chatInputValues[action.payload.chatId]) {
        state.chatInputValues[action.payload.chatId] = {
          attachedItems: [],
          messageText: '',
        };
      }
    },
    updateChatInputValue: (
      state,
      action: PayloadAction<{
        chatId: string | null;
        attachedItems?: AttachedItemType[];
        messageText?: string;
      }>,
    ) => {
      if (action.payload.attachedItems !== undefined) {
        const currentStateItems =
          state.chatInputValues[action.payload.chatId || 'localeState']
            .attachedItems || [];
        state.chatInputValues[
          action.payload.chatId || 'localeState'
        ].attachedItems = [
          ...currentStateItems,
          ...action.payload.attachedItems,
        ];
      }
      if (action.payload.messageText !== undefined) {
        state.chatInputValues[
          action.payload.chatId || 'localeState'
        ].messageText = action.payload.messageText;
      }
    },
    setChatInputValue: (
      state,
      action: PayloadAction<{
        chatId: string | null;
        attachedItems?: AttachedItemType[];
        messageText?: string;
      }>,
    ) => {
      if (action.payload.attachedItems !== undefined) {
        state.chatInputValues[
          action.payload.chatId || 'localeState'
        ].attachedItems = action.payload.attachedItems;
      }
      if (action.payload.messageText !== undefined) {
        state.chatInputValues[
          action.payload.chatId || 'localeState'
        ].messageText = action.payload.messageText;
      }
    },
    clearChatInputValue: (
      state,
      action: PayloadAction<{
        chatId: string | null;
      }>,
    ) => {
      state.chatInputValues[
        action.payload.chatId || 'localeState'
      ].messageText = '';
      state.chatInputValues[
        action.payload.chatId || 'localeState'
      ].attachedItems = [];
    },
    filterAttachedItemsChatInputValue: (
      state,
      action: PayloadAction<{
        chatId: string | null;
        attachedItem: AttachedItemType;
      }>,
    ) => {
      state.chatInputValues[
        action.payload.chatId || 'localeState'
      ].attachedItems = state.chatInputValues[
        action.payload.chatId || 'localeState'
      ].attachedItems.filter((filteredItem) => filteredItem.fileObject !== action.payload.attachedItem.fileObject);
    },
  },
});

export const { addChatInputValue, updateChatInputValue, setChatInputValue, clearChatInputValue, filterAttachedItemsChatInputValue } =
  chatInputValuesSlice.actions;
export const { selectChatInputValues } = chatInputValuesSlice.selectors;
export default chatInputValuesSlice.reducer;
