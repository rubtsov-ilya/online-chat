import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMemberDetails } from 'src/interfaces/ChatsWithDetails.interface';

interface IInitialState {
  activeChatId: null | string;
  activeChatname: null | string;
  activeChatAvatar: null | string;
  activeChatBlocked: null | string[]; // только не групповые чаты
  activeChatMembers: null | IMemberDetails[]; // только групповые чаты
  activeChatIsGroup: null | boolean;
  activeChatGroupAdminUrl: null | string;
}

const initialState: IInitialState = {
  activeChatId: null,
  activeChatname: null,
  activeChatAvatar: null,
  activeChatBlocked: null,
  activeChatMembers: null,
  activeChatIsGroup: null,
  activeChatGroupAdminUrl: null,
};

const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState,
  selectors: {
    selectActiveChat: (state) => state,
  },
  reducers: {
    setActiveChatId(
      state,
      action: PayloadAction<Pick<IInitialState, 'activeChatId'>>,
    ) {
      state.activeChatId = action.payload.activeChatId;
    },
    setActiveChat(state, action: PayloadAction<IInitialState>) {
      state.activeChatId = action.payload.activeChatId;
      state.activeChatname = action.payload.activeChatname;
      state.activeChatAvatar = action.payload.activeChatAvatar;
      state.activeChatIsGroup = action.payload.activeChatIsGroup;
      state.activeChatBlocked = action.payload.activeChatBlocked;
      state.activeChatMembers = action.payload.activeChatMembers;
      state.activeChatGroupAdminUrl = action.payload.activeChatGroupAdminUrl;
    },
    setActiveChatnameAndAvatar(
      state,
      action: PayloadAction<
        Partial<Pick<IInitialState, 'activeChatname' | 'activeChatAvatar'>>
      >,
    ) {
      if (action.payload.activeChatname !== undefined) {
        state.activeChatname = action.payload.activeChatname;
      }
      if (action.payload.activeChatAvatar !== undefined) {
        state.activeChatAvatar = action.payload.activeChatAvatar;
      }
    },
    setActiveChatBlocked(
      state,
      action: PayloadAction<Pick<IInitialState, 'activeChatBlocked'>>,
    ) {
      state.activeChatBlocked = action.payload.activeChatBlocked;
    },
    setActiveChatMembers(
      state,
      action: PayloadAction<Pick<IInitialState, 'activeChatMembers'>>,
    ) {
      state.activeChatMembers = action.payload.activeChatMembers;
    },
    removeActiveChat(state) {
      state.activeChatId = null;
      state.activeChatname = null;
      state.activeChatAvatar = null;
      state.activeChatBlocked = null;
      state.activeChatMembers = null;
      state.activeChatIsGroup = null;
      state.activeChatGroupAdminUrl = null;
    },
  },
});

export const {
  setActiveChatId,
  removeActiveChat,
  setActiveChatnameAndAvatar,
  setActiveChatBlocked,
  setActiveChatMembers,
  setActiveChat,
} = activeChatSlice.actions;
export const { selectActiveChat } = activeChatSlice.selectors;
export default activeChatSlice.reducer;
