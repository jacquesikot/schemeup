const generateForeignKeyName = (tableName: string, colName: string, refTable: string, refColumn: string): string => {
  const columnName = colName;
  const referenceTableName = refTable;
  const referenceColumnName = refColumn;

  // Generate the foreign key name using a standardized format
  const foreignKeyName = `fk_${tableName}_${columnName}_to_${referenceTableName}_${referenceColumnName}`;

  return foreignKeyName;
};

export default generateForeignKeyName;
