import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Default {
  downloadFormat: string;
  importDatabaseType: string;
}

interface Settings {
  selectedFormat: string;
  defaults: Default;
}

const initialState: Settings = {
  selectedFormat: "CSV",
  defaults: {
    downloadFormat: "CSV",
    importDatabaseType: "Postgres"
  }
}

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedFormat: (state, action: PayloadAction<string>) => {
      state.selectedFormat = action.payload;
    },
    setDownloadFormat: (state, action: PayloadAction<string>) => {
      state.selectedFormat = action.payload;
      state.defaults.downloadFormat = action.payload;
    },
    setImportDatabaseType: (state, action: PayloadAction<Default>) => {
      state.defaults.importDatabaseType = action.payload.importDatabaseType;
    },
  }
})

export const { setSelectedFormat, setDownloadFormat, setImportDatabaseType } = settingSlice.actions;

export default settingSlice.reducer;

