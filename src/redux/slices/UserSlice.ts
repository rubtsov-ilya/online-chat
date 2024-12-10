import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  email: null | string;
  uid: null | string;
  avatar: null | string;
  username: null | string;
}

const initialState: IInitialState = {
  email: null,
  uid: null,
  avatar: null,
  username: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: (state) => state,
  },
  reducers: {
    setUserWithoutUsername(state, action: PayloadAction<Omit<IInitialState, 'username'>>) {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.avatar = action.payload.avatar;
    },
    setUsername(state, action: PayloadAction<Pick<IInitialState, 'username'>>) {
      state.username = action.payload.username;
    },
    removeUser(state) {
      state.email = null;
      state.uid = null;
      state.avatar = null;
    },
  },
});

export const { setUsername, setUserWithoutUsername, removeUser } = userSlice.actions;
export const { selectUser } = userSlice.selectors;
export default userSlice.reducer;
