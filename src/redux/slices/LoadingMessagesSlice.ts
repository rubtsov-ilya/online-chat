import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from 'src/interfaces/Message.interface';

interface IInitialState {
  loadingMessagesArray: IMessage[];
}

const initialState: IInitialState = {
  loadingMessagesArray: [],
};

const loadingMessagesSlice = createSlice({
  name: 'loadingMessages',
  initialState,
  selectors: {
    selectLoadingMessage: (state) => state,
  },
  reducers: {
    addLoadingMessage(state, action: PayloadAction<IMessage>) {
      state.loadingMessagesArray = [
        ...state.loadingMessagesArray,
        action.payload,
      ];
    },
    removeLoadingMessage(state, action) {
      state.loadingMessagesArray = state.loadingMessagesArray.filter(
        (item: IMessage) => item != action.payload,
      );
    },
  },
});

export const { addLoadingMessage, removeLoadingMessage } =
  loadingMessagesSlice.actions;
export const { selectLoadingMessage } = loadingMessagesSlice.selectors;
export default loadingMessagesSlice.reducer;
