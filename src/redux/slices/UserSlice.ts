import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  email: null | string;
  token: null | string;
  uid: null | string;
  uMockid: null | string;
}

const initialState: IInitialState = {
  email: null,
  token: null,
  uid: null,
  uMockid: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    selectUser: state => state,
  },
  reducers: {
    setUser(state, action: PayloadAction<IInitialState>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.uid = action.payload.uid;
      state.uMockid = action.payload.uMockid;
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.uid = null;
      state.uMockid = null;
    }
  },
});

export const { setUser, removeUser } = userSlice.actions
export const { selectUser } = userSlice.selectors
export default userSlice.reducer
