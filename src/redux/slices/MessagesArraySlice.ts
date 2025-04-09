import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoadingMessage } from 'src/interfaces/LoadingMessage.interface';
import { IMessage } from 'src/interfaces/Message.interface';

interface IInitialState {
  messagesArray: (IMessage | ILoadingMessage)[];
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
    addInitialMessagesArray(state, action: PayloadAction<IMessage[]>) {
      state.messagesArray = action.payload.map((item) => ({
        ...item,
        messageDateUTC: `${new Date(item.messageDateUTC as string | number)}`,
      }));
    },
    addLoadingMessage(state, action: PayloadAction<ILoadingMessage>) {
      state.messagesArray = [
        ...state.messagesArray,
        {
          ...action.payload,
          messageDateUTC: `${new Date(action.payload.messageDateUTC as string | number)}`,
        },
      ];
    },
    addMessage(state, action: PayloadAction<IMessage[]>) {
      state.messagesArray = [
        ...state.messagesArray,
        ...action.payload.map((item) => ({
          ...item,
          messageDateUTC: `${new Date(item.messageDateUTC as string | number)}`,
        })),
      ];
    },
    addMessages(state, action: PayloadAction<IMessage[]>) {
      const currentMessagesMap = new Map(state.messagesArray.map(m => [m.messageId, m]));
    
      action.payload.forEach(newMessage => {

        // если сообщение уже есть в массиве, то его только обновить
        if (currentMessagesMap.has(newMessage.messageId)) {
          const existingMessage = currentMessagesMap.get(newMessage.messageId)!;
          currentMessagesMap.set(newMessage.messageId, {
            ...existingMessage,
            ...newMessage,
            media: existingMessage.media,
            messageDateUTC: `${new Date(newMessage.messageDateUTC as string | number)}`
          });
        } else {
          // если сообщения нет в массиве, то его добавить
          currentMessagesMap.set(newMessage.messageId, {
            ...newMessage,
            messageDateUTC: `${new Date(newMessage.messageDateUTC as string | number)}`
          });
        }
      });
    
      const allMessages = Array.from(currentMessagesMap.values());
    
      state.messagesArray = allMessages.sort(
        (a, b) =>
          new Date(a.messageDateUTC as string).getTime() -
          new Date(b.messageDateUTC as string).getTime(),
      );
    },
    removeLoadingMessage(state, action) {
      state.messagesArray = state.messagesArray.filter(
        (item: IMessage) => item != action.payload,
      );
    },
    updateProgressKeyInMessage(
      state,
      action: PayloadAction<{
        messageId: string;
        loadingId: string;
        progress: number;
        filePath: 'media' | 'files';
      }>,
    ) {
      const message = state.messagesArray.find(
        (message) => message.messageId === action.payload.messageId,
      ) as ILoadingMessage | undefined;
      /* обновление для файлов из media */
      if (message) {
        if (action.payload.filePath === 'media') {
          const mediaItem = message.media.find(
            (item) => item.loadingId === action.payload.loadingId,
          );

          if (mediaItem) {
            mediaItem.progress = action.payload.progress;
          }
        }
        /* обновление для файлов из files */
        if (action.payload.filePath === 'files') {
          const mediaItem = message.files.find(
            (item) => item.loadingId === action.payload.loadingId,
          );
          if (mediaItem) {
            mediaItem.progress = action.payload.progress;
          }
        }
      }
    },
    updateProgressPreviewKeyInMessage(
      state,
      action: PayloadAction<{
        messageId: string;
        loadingId: string;
        progress: number;
      }>,
    ) {
      const message = state.messagesArray.find(
        (message) => message.messageId === action.payload.messageId,
      ) as ILoadingMessage | undefined;
      /* обновление для файлов из media */
      if (message) {
        const mediaItem = message.media.find(
          (item) => item.loadingId === action.payload.loadingId,
        );

        if (mediaItem && 'progressPreview' in mediaItem) {
          mediaItem.progressPreview = action.payload.progress;
        }
      }
    },
    updateIsCanceledKeyInMessage(
      state,
      action: PayloadAction<{
        messageId: string;
      }>,
    ) {
      const message = state.messagesArray.find(
        (message) => message.messageId === action.payload.messageId,
      ) as ILoadingMessage | undefined;
      /* обновление для файлов из media */
      if (message && message.isCanceled !== true) {
        message.isCanceled = true;
      }
    },
    clearMessages(
      state,
    ) {
      state.messagesArray = [];
    },
  },
});

export const {
  addLoadingMessage,
  addMessage,
  addMessages,
  removeLoadingMessage,
  addInitialMessagesArray,
  updateProgressKeyInMessage,
  updateProgressPreviewKeyInMessage,
  updateIsCanceledKeyInMessage,
  clearMessages,
} = messagesArraySlice.actions;
export const { selectMessagesArray } = messagesArraySlice.selectors;
export default messagesArraySlice.reducer;
