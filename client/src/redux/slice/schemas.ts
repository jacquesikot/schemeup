import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PostgresColumnType,
  PostgresIndexSorting,
  PostgresOnDeleteOption,
  PostgresOnUpdateOption,
} from '../../types/tableTypes';
import generateForeignKeyName from '../../utils/generateFkName';

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
    name: string;
    column: string;
    referenceTable: string;
    referenceColumn: string;
    onUpdate: PostgresOnUpdateOption;
    onDelete: PostgresOnDeleteOption;
  }[];
  indexes: { column: string; unique: boolean; sorting: PostgresIndexSorting }[];
}

export enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

export interface SchemaUser {
  name: string;
  email: string;
  role: Role;
  photo?: string;
}

export interface Schema {
  id: string;
  title: string;
  userId: string;
  description?: string;
  tables?: Table[];
  activeTable?: string;
  users?: SchemaUser[];
  meta?: any;
  hasUnsavedChanges?: boolean;
  isPublic?: boolean;
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
        userId: action.payload.userId,
        hasUnsavedChanges: true,
        description: 'A user and post default schema for reference. Feel free to delete this',
        tables: [
          {
            id: '1',
            name: 'user',
            columns: [
              { name: 'id', type: 'int', nullable: false, primaryKey: true, unique: true, autoInc: true },
              { name: 'name', type: 'text', nullable: false, primaryKey: false, unique: false, index: true },
              { name: 'email', type: 'text', nullable: false, primaryKey: false, unique: true },
              {
                name: 'created_at',
                type: 'timestamp with time zone',
                nullable: false,
                primaryKey: false,
                unique: false,
                default: 'now()',
              },
              {
                name: 'updated_at',
                type: 'timestamp with time zone',
                nullable: false,
                primaryKey: false,
                unique: false,
                autoUpdateTime: true,
              },
            ],
            foreignKeys: [],
            indexes: [{ column: 'name', unique: false, sorting: 'ASC' }],
          },
          {
            id: '2',
            name: 'post',
            columns: [
              { name: 'id', type: 'int', nullable: false, primaryKey: true, unique: true, autoInc: true },
              { name: 'title', type: 'text', nullable: false, primaryKey: false, unique: false },
              { name: 'content', type: 'text', nullable: true, primaryKey: false, unique: false },
              { name: 'user_id', type: 'int', nullable: true, primaryKey: false, unique: false },
            ],
            foreignKeys: [
              {
                name: generateForeignKeyName('user', 'user_id', 'user', 'id'),
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
        meta: {
          showColumns: true,
        },
      });
    },
    setNewChanges: (state, action: PayloadAction<{ schemaId: string; hasUnsavedChanges: boolean }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].hasUnsavedChanges = action.payload.hasUnsavedChanges;
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
      state.schemas[index].hasUnsavedChanges = true;
    },
    deleteTable: (state, action: PayloadAction<{ schemaId: string; tableId: string }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].tables = state.schemas[index].tables?.filter((table) => table.id !== action.payload.tableId);
      state.schemas[index].hasUnsavedChanges = true;
    },
    editTable: (state, action: PayloadAction<{ schemaId: string; table: Table }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      const tableIndex = state.schemas[index].tables?.findIndex((table) => table.id === action.payload.table.id);
      if (tableIndex !== undefined && tableIndex !== -1) {
        state.schemas[index].tables![tableIndex] = action.payload.table;
        state.schemas[index].hasUnsavedChanges = true;
      }
    },
    addSchemaUsers: (state, action: PayloadAction<{ schemaId: string; users: SchemaUser[] }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      if (state.schemas[index].users) {
        state.schemas[index].users = [...state.schemas[index].users!, ...action.payload.users];
      } else {
        state.schemas[index].users = [...action.payload.users];
      }
      state.schemas[index].hasUnsavedChanges = true;
    },
    removeSchemaUsers: (state, action: PayloadAction<{ schemaId: string; users: SchemaUser[] }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].users = state.schemas[index].users?.filter(
        (user) => !action.payload.users.find((u) => u.email === user.email)
      );
      state.schemas[index].hasUnsavedChanges = true;
    },
    updateSchemaUser: (state, action: PayloadAction<{ schemaId: string; user: SchemaUser }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      const userIndex = state.schemas[index].users?.findIndex((user) => user.email === action.payload.user.email);
      if (userIndex !== undefined && userIndex !== -1) {
        state.schemas[index].users![userIndex] = action.payload.user;
        state.schemas[index].hasUnsavedChanges = true;
      }
    },
    importTables: (state, action: PayloadAction<{ schemaId: string; tables: Table[] }>) => {
      const index = state.schemas.findIndex((schema) => schema.id === action.payload.schemaId);
      state.schemas[index].tables = action.payload.tables;
      state.schemas[index].hasUnsavedChanges = true;
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
  addSchemaUsers,
  removeSchemaUsers,
  updateSchemaUser,
  setNewChanges,
} = schemasSlice.actions;

export default schemasSlice.reducer;
