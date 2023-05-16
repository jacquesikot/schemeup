import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tab {
  title: string;
  route: string;
}

interface Tabs {
  tabs: Tab[];
  prevRoute: string;
}

const initialState: Tabs = {
  tabs: [{ title: 'Schema', route: '/' }],
  prevRoute: '/',
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setNewTab: (state, { payload }: PayloadAction<Tab>) => {
      state.tabs = [...state.tabs, payload];
    },
    removeTab: (state, { payload }: PayloadAction<string>) => {
      state.tabs = state.tabs.filter((tab) => tab.title !== payload);
    },
    resetTabs: () => initialState,
  },
});

export const { setNewTab, removeTab, resetTabs } = tabsSlice.actions;

export default tabsSlice.reducer;