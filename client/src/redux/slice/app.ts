import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SnackbarMessage } from '../../components/global/SnackNotification';
import { AlertColor } from '@mui/material';

interface AppState {
  sideBarOpen: boolean;
  codeEditorOpen: boolean;
  rightPanelOpen: boolean;
  snackPack: SnackbarMessage[];
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
    triggerSnack: (state, action: PayloadAction<{ message: string; severity: AlertColor; hideDuration: number }>) => {
      state.snackPack = [
        {
          message: action.payload.message,
          severity: action.payload.severity,
          hideDuration: action.payload.hideDuration,
          key: new Date().getTime() + Math.random(),
        },
      ];
      state.showSnack = true;
    },
    unloadSnacks: (state) => {
      state.snackPack = [];
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
  triggerSnack,
  setShowSnack,
  openRightPanel,
  unloadSnacks,
} = appSlice.actions;

export default appSlice.reducer;
