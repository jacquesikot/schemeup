import { createSlice } from '@reduxjs/toolkit';
import { SnackbarMessage } from '../../components/global/SnackNotification';

interface AppState {
  sideBarOpen: boolean;
  codeEditorOpen: boolean;
  rightPanelOpen: boolean;
  snackPack: readonly SnackbarMessage[];
  showSnack: boolean;
}

const initialState: AppState = {
  sideBarOpen: true,
  codeEditorOpen: false,
  rightPanelOpen: true,
  snackPack: [],
  showSnack: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.sideBarOpen = !state.sideBarOpen;
    },
    toggleCodeEditor: (state) => {
      state.codeEditorOpen = !state.codeEditorOpen;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    openRightPanel: (state) => {
      state.rightPanelOpen = true;
    },
    hideCodeEditor: (state) => {
      state.codeEditorOpen = false;
    },
    setSnackPack: (state, action) => {
      state.snackPack = action.payload;
      state.showSnack = true;
    },
    setShowSnack: (state, action) => {
      state.showSnack = action.payload;
    },
  },
});

export const {
  toggleCodeEditor,
  toggleRightPanel,
  toggleSideBar,
  hideCodeEditor,
  setSnackPack,
  setShowSnack,
  openRightPanel,
} = appSlice.actions;

export default appSlice.reducer;
