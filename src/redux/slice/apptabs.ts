import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tabs {
  tabs: any[];
  activeTab: any;
}

const initialState: Tabs = {
  tabs: [{ id: 1, title: 'Schema', route: '/' }],
  activeTab: { id: 1, title: 'Schema', route: '/' },
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setNewTab: (state, { payload }: PayloadAction<object>) => {
      state.tabs = [...state.tabs, payload];
    },
    removeTab: (state, { payload }: PayloadAction<number>) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== payload);
    },
    setActiveTab: (state, { payload }: PayloadAction<object>) => {
      state.activeTab = payload;
    },
  },
});

export const { setNewTab, removeTab, setActiveTab } = tabsSlice.actions;

export default tabsSlice.reducer;
