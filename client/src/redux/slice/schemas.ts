import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PostgresColumnType,
  PostgresIndexSorting,
  PostgresOnDeleteOption,
  PostgresOnUpdateOption,
} from '../../types/tableTypes';

export interface Table {
  id: string;
  name: string;
  meta?: any;
  columns: {
    name: string;
    type: PostgresColumnType;
    nullable: boolean;
    primaryKey: boolean;
    unique: boolean;
    comment?: string;
    index?: boolean;
    autoInc?: boolean;
    default?: string;
    autoUpdateTime?: boolean;
  }[];
  foreignKeys: {
    column: string;
    referenceTable: string;
    referenceColumn: string;
    onUpdate: PostgresOnUpdateOption;
    onDelete: PostgresOnDeleteOption;
  }[];
  indexes: { column: string; unique: boolean; sorting: PostgresIndexSorting }[];
}

export interface Schema {
  id: string;
  title: string;
  description?: string;
  tables?: Table[];
  activeTable?: string;
  meta?: any;
}

interface SchemaState {
  schemas: Schema[];
}

const initialState: SchemaState = {
  schemas: [],
};

const schemasSlice = createSlice({
  name: 'schemas',
  initialState,
  reducers: {
    newSchema: (state, action: PayloadAction<Schema>) => {
      state.schemas.push(action.payload);
    },
    updateSchema: (state, action: PayloadAction<Schema>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.id);
      state.schemas[index] = action.payload;
    },
    deleteSchema: (state, action: PayloadAction<string>) => {
      state.schemas = state.schemas.filter((schema) => schema.id !== action.payload);
    },
    newTable: (state, action: PayloadAction<{ schemaId: string; table: Table }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].tables?.push(action.payload.table);
    },
    deleteTable: (state, action: PayloadAction<{ schemaId: string; tableId: string }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].tables = state.schemas[index].tables?.filter((table) => table.id !== action.payload.tableId);
    },
    editTable: (state, action: PayloadAction<{ schemaId: string; table: Table }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      const tableIndex = state.schemas[index].tables?.findIndex((table) => table.id === action.payload.table.id);
      if (tableIndex !== undefined && tableIndex !== -1) {
        state.schemas[index].tables![tableIndex] = action.payload.table;
      }
    },
    importTables: (state, action: PayloadAction<{ schemaId: string; tables: Table[] }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].tables = action.payload.tables;
    },
    setActiveTable: (state, action: PayloadAction<{ schemaId: string; tableId: string }>) => {
      if (action.payload.tableId.length < 1) {
        const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
        state.schemas[index].activeTable = '';
      } else {
        const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
        state.schemas[index].activeTable = action.payload.tableId;
      }
    },
    setSchemas: (state, action: PayloadAction<Schema[]>) => {
      state.schemas = action.payload;
    },
    // dev only
    clearSchemas: (state) => {
      state.schemas = [];
    },
  },
});

export const {
  newSchema,
  updateSchema,
  deleteSchema,
  clearSchemas,
  newTable,
  deleteTable,
  editTable,
  setActiveTable,
  importTables,
  setSchemas,
} = schemasSlice.actions;

export default schemasSlice.reducer;
