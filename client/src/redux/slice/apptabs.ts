import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import routes from '../../routes';
import { v4 as uuidv4 } from 'uuid';

export interface Tab {
  id: string;
  title: string;
  route: string;
}

interface Tabs {
  tabs: Tab[];
  prevRoute: string;
}

const initialState: Tabs = {
  tabs: [{ id: uuidv4(), title: 'Schema', route: routes.HOME }],
  prevRoute: routes.HOME,
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
