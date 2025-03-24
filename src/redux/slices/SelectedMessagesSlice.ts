import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';
import { ISelectedMessage } from 'src/interfaces/SelectedMessage.interface';

interface IInitialState {
  isMessagesSelecting: boolean;
  isMessagesForwarding: boolean;
  selectedMessages: ISelectedMessage[];
  selectedChatId: null | string;
  selectedChatMembers: null | IMemberDetails[];
}

const initialState: IInitialState = {
  isMessagesSelecting: false,
  isMessagesForwarding: false,
  selectedMessages: [],
  selectedChatId: null,
  selectedChatMembers: null,
};

const selectedMessagesSlice = createSlice({
  name: 'selectedMessages',
  initialState,
  selectors: {
    selectMessages: (state) => state,
  },
  reducers: {
    addSelectedMessage(
      state,
      action: PayloadAction<{
        selectedMessage: ISelectedMessage;
        selectedChatId: string;
        selectedChatMembers: IMemberDetails[];
      }>,
    ) {
      state.isMessagesSelecting = true;
      state.selectedChatId = action.payload.selectedChatId;
      state.selectedChatMembers = action.payload.selectedChatMembers;
      state.selectedMessages = [
        ...state.selectedMessages,
        action.payload.selectedMessage,
      ].sort((a, b) => {
        const dateA =
          typeof a.messageDateUTC === 'number'
            ? a.messageDateUTC
            : Number(a.messageDateUTC);
        const dateB =
          typeof b.messageDateUTC === 'number'
            ? b.messageDateUTC
            : Number(b.messageDateUTC);

        // Если даты некорректны, возвращаем 0 (или другое значение по умолчанию)
        if (isNaN(dateA) || isNaN(dateB)) {
          console.warn('Некорректные данные messageDateUTC:', { a, b });
          return 0;
        }

        return dateA - dateB;
      });
    },
    removeSelectedMessage(
      state,
      action: PayloadAction<{
        selectedMessage: ISelectedMessage;
      }>,
    ) {
      const filteredSelectedMessages = state.selectedMessages
        .filter(
          (selectedMessage) =>
            selectedMessage.messageId !==
            action.payload.selectedMessage.messageId,
        )
        .sort((a, b) => {
          const dateA =
            typeof a.messageDateUTC === 'number'
              ? a.messageDateUTC
              : Number(a.messageDateUTC);
          const dateB =
            typeof b.messageDateUTC === 'number'
              ? b.messageDateUTC
              : Number(b.messageDateUTC);

          // Если даты некорректны, возвращаем 0 (или другое значение по умолчанию)
          if (isNaN(dateA) || isNaN(dateB)) {
            console.warn('Некорректные данные messageDateUTC:', { a, b });
            return 0;
          }

          return dateA - dateB;
        });
      state.selectedMessages = filteredSelectedMessages;

      if (filteredSelectedMessages.length === 0) {
        state.isMessagesSelecting = false;
        state.selectedChatId = null;
        state.selectedChatMembers = null;
      }
    },
    clearSelectedMessagesState(state) {
      state.isMessagesSelecting = false;
      state.selectedChatId = null;
      state.selectedChatMembers = null;
      state.selectedMessages = [];
      state.isMessagesForwarding = false;
    },
    setIsMessagesForwarding(
      state,
      action: PayloadAction<{
        isMessagesForwarding: boolean;
      }>,
    ) {
      state.isMessagesForwarding = action.payload.isMessagesForwarding;
    },
    setIsMessagesSelecting(
      state,
      action: PayloadAction<{
        isMessagesSelecting: boolean;
      }>,
    ) {
      state.isMessagesSelecting = action.payload.isMessagesSelecting;
    },
  },
});

export const {
  addSelectedMessage,
  removeSelectedMessage,
  clearSelectedMessagesState,
  setIsMessagesForwarding,
  setIsMessagesSelecting,
} = selectedMessagesSlice.actions;
export const { selectMessages } = selectedMessagesSlice.selectors;
export default selectedMessagesSlice.reducer;
