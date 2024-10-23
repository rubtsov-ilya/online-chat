import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from 'src/interfaces/Message.interface';

interface IInitialState {
  messagesArray: IMessage[];
}

const initialState: IInitialState = {
  messagesArray: [],
};

const messagesArraySlice = createSlice({
  name: 'messagesArray',
  initialState,
  selectors: {
    selectMessagesArray: (state) => state,
  },
  reducers: {
    addLoadingMessage(state, action: PayloadAction<IMessage>) {
      state.messagesArray = [...state.messagesArray, action.payload];
    },
    removeLoadingMessage(state, action) {
      state.messagesArray = state.messagesArray.filter(
        (item: IMessage) => item != action.payload,
      );
    },
  },
});

export const { addLoadingMessage, removeLoadingMessage } =
  messagesArraySlice.actions;
export const { selectMessagesArray } = messagesArraySlice.selectors;
export default messagesArraySlice.reducer;
