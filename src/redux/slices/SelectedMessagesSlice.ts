import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISelectedMessage } from 'src/interfaces/SelectedMessage.interface';

interface IInitialState {
  isMessagesSelecting: boolean;
  selectedMessages: ISelectedMessage[];
}

const initialState: IInitialState = {
  isMessagesSelecting: false,
  selectedMessages: [],
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
      }>,
    ) {
      state.isMessagesSelecting = true;
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
      state.selectedMessages = state.selectedMessages
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
    },
    clearSelectedMessagesState(state) {
      state.isMessagesSelecting = false;
      state.selectedMessages = [];
    },
  },
});

export const {} = selectedMessagesSlice.actions;
export const { selectMessages } = selectedMessagesSlice.selectors;
export default selectedMessagesSlice.reducer;
