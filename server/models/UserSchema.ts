import mongoose, { Schema as MongooseSchema, Schema } from 'mongoose';

import {
  PostgresColumnType,
  PostgresOnDeleteOption,
  PostgresOnUpdateOption,
  PostgresIndexSorting,
} from '../../client/src/types/tableTypes';

interface Table {
  id: string;
  name: string;
  comment?: string;
  //   meta?: any;
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

export interface IUserSchema {
  id: string;
  title: string;
  description?: string;
  tables?: Table[];
  //   meta?: any;
}

interface UserSchemaModelInterface extends mongoose.Model<any> {
  build(attr: IUserSchema): any;
}

const ColumnSchema = new MongooseSchema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // You need to map your PostgresColumnType to the Mongoose type system
  nullable: { type: Boolean, default: false },
  primaryKey: { type: Boolean, default: false },
  unique: { type: Boolean, default: false },
  comment: String,
  index: { type: Boolean, default: false },
  autoInc: { type: Boolean, default: false },
  default: String,
  autoUpdateTime: { type: Boolean, default: false },
});

const ForeignKeySchema = new MongooseSchema({
  column: { type: String, required: true },
  referenceTable: { type: String, required: true },
  referenceColumn: { type: String, required: true },
  onUpdate: { type: String, required: true }, // Map your PostgresOnUpdateOption to a suitable value
  onDelete: { type: String, required: true }, // Map your PostgresOnDeleteOption to a suitable value
});

const IndexSchema = new MongooseSchema({
  column: { type: String, required: true },
  unique: { type: Boolean, default: false },
  sorting: { type: String, required: true }, // Map your PostgresIndexSorting to a suitable value
});

const TableSchema = new MongooseSchema({
  name: { type: String, required: true },
  comment: String,
  columns: [ColumnSchema],
  foreignKeys: [ForeignKeySchema],
  indexes: [IndexSchema],
});

const UserSchemaSchema = new MongooseSchema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  tables: [TableSchema],
});

UserSchemaSchema.statics.build = (attr: IUserSchema) => {
  return new UserSchema(attr);
};

const UserSchema = mongoose.model<any, UserSchemaModelInterface>('Schema', UserSchemaSchema);

const validateUserSchema = (schema: IUserSchema) => {
  const newUserSchema = new UserSchema(schema);
  const validationError = newUserSchema.validateSync();
  return validationError;
};
export { UserSchema, validateUserSchema };
