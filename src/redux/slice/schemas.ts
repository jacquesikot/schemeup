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
  columns: {
    name: string;
    type: PostgresColumnType;
    nullable: boolean;
    primaryKey: boolean;
    unique: boolean;
    comment?: string;
    default?: string;
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

interface Schema {
  id: string;
  title: string;
  description?: string;
  tables?: Table[];
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
      state.schemas.push({
        id: action.payload.id,
        title: action.payload.title,
        description: 'A user and post default schema for reference. Feel free to delete this',
        tables: [
          {
            id: '1',
            name: 'user',
            columns: [
              { name: 'id', type: 'int', nullable: false, primaryKey: true, unique: true },
              { name: 'name', type: 'text', nullable: false, primaryKey: false, unique: false },
              { name: 'email', type: 'text', nullable: false, primaryKey: false, unique: true },
            ],
            foreignKeys: [],
            indexes: [{ column: 'name', unique: false, sorting: 'ASC' }],
          },
          {
            id: '2',
            name: 'post',
            columns: [
              { name: 'id', type: 'int', nullable: false, primaryKey: true, unique: true },
              { name: 'title', type: 'text', nullable: false, primaryKey: false, unique: false },
              { name: 'content', type: 'text', nullable: true, primaryKey: false, unique: false },
              { name: 'user_id', type: 'int', nullable: true, primaryKey: false, unique: false },
            ],
            foreignKeys: [
              {
                column: 'user_id',
                referenceTable: 'user',
                referenceColumn: 'id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
              },
            ],
            indexes: [{ column: 'title', unique: false, sorting: 'ASC' }],
          },
        ],
      });
    },
    updateSchema: (state, action: PayloadAction<Schema>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.id);
      state.schemas[index] = action.payload;
    },
    deleteSchema: (state, action: PayloadAction<string>) => {
      state.schemas = state.schemas.filter((schema) => schema.id !== action.payload);
    },
    // dev only
    clearSchemas: (state) => {
      state.schemas = [];
    },
  },
});

export const { newSchema, updateSchema, deleteSchema, clearSchemas } = schemasSlice.actions;

export default schemasSlice.reducer;
