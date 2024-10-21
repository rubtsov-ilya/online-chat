import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IImgMedia {
  imgUrl: string;
  isHorizontal: boolean;
  isSquare: boolean;
}

export interface IVideoMedia {
  isHorizontal: boolean;
  isSquare: boolean;
  videoUrl: string;
  videoPreview: string;
}

export interface IFile {
  fileUrl: string;
  fileName: string;
}

export interface ILoadingMessage {
  messageText: string;
  messageDateUTC: string;
  messageId: string;
  isChecked: boolean;
  senderUid: string;
  userAvatar: string;
  media: (IImgMedia | IVideoMedia)[];
  files: IFile[];
}
interface IInitialState {
  loadingMessagesArray: ILoadingMessage[];
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
    addLoadingMessage(state, action: PayloadAction<ILoadingMessage>) {
      state.loadingMessagesArray = [
        ...state.loadingMessagesArray,
        action.payload,
      ];
    },
    removeLoadingMessage(state, action) {
      state.loadingMessagesArray = state.loadingMessagesArray.filter(
        (item: ILoadingMessage) => item != action.payload,
      );
    },
  },
});

export const { addLoadingMessage, removeLoadingMessage } =
  loadingMessagesSlice.actions;
export const { selectLoadingMessage } = loadingMessagesSlice.selectors;
export default loadingMessagesSlice.reducer;
