import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  id: string;
  [prop: string]: string;
}

interface UserState {
  activeUser: User;
}


const initialState: UserState = {
  activeUser: {
    name: "Anonymous",
    email: "",
    id: "",
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }: PayloadAction<User>) => {
      state.activeUser = { ...payload }
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;

