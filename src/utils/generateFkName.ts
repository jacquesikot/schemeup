import { Table } from '../redux/slice/schemas';

const generateForeignKeyName = (table: Table, foreignKeyIndex: number): string => {
  const foreignKey = table.foreignKeys[foreignKeyIndex];
  const tableName = table.name;
  const columnName = foreignKey.column;
  const referenceTableName = foreignKey.referenceTable;
  const referenceColumnName = foreignKey.referenceColumn;

  // Generate the foreign key name using a standardized format
  const foreignKeyName = `fk_${tableName}_${columnName}_to_${referenceTableName}_${referenceColumnName}`;

  return foreignKeyName;
};

export default generateForeignKeyName;
