import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  sideBarOpen: boolean;
  codeEditorOpen: boolean;
  rightPanelOpen: boolean;
}

const initialState: AppState = {
  sideBarOpen: true,
  codeEditorOpen: false,
  rightPanelOpen: true,
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
    hideCodeEditor: (state) => {
      state.codeEditorOpen = false;
    },
  },
});

export const { toggleCodeEditor, toggleRightPanel, toggleSideBar, hideCodeEditor } = appSlice.actions;

export default appSlice.reducer;
