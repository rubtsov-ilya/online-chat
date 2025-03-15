import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  email: null | string;
  uid: null | string;
  avatar: null | string;
  username: null | string;
  blocked: null | string[];
}

const initialState: IInitialState = {
  email: null,
  uid: null,
  avatar: null,
  username: null,
  blocked: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: (state) => state,
  },
  reducers: {
    setUser(state, action: PayloadAction<IInitialState>) {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.avatar = action.payload.avatar;
      state.username = action.payload.username;
      state.blocked = action.payload.blocked;
    },
    removeUser(state) {
      state.email = null;
      state.uid = null;
      state.avatar = null;
      state.username = null;
      state.blocked = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const { selectUser } = userSlice.selectors;
export default userSlice.reducer;

