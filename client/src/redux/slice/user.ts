import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  id: string;
  photoUrl?: string;
}

interface UserState {
  activeUser: User | null;
}

const initialState: UserState = {
  activeUser: {
    name: 'Anonymous',
    email: '',
    id: '',
    photoUrl: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }: PayloadAction<User | null>) => {
      state.activeUser = payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
