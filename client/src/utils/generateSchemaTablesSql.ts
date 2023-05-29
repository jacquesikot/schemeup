import { Table } from '../redux/slice/schemas';

const generateSchemaTablesSql = (tableConfigs: Table[]) => {
  const createStatements = tableConfigs.map((tableConfig) => {
    const columns = tableConfig.columns
      .map((column) => {
        const { name, type, nullable, primaryKey, unique, autoInc, default: defaultValue } = column;
        let columnStr = `"${name}" ${type}`;
        if (!nullable) columnStr += ' NOT NULL';
        if (primaryKey) columnStr += ' PRIMARY KEY';
        if (unique) columnStr += ' UNIQUE';
        if (autoInc) columnStr += ' GENERATED ALWAYS AS IDENTITY';
        if (defaultValue !== undefined) columnStr += ` DEFAULT ${defaultValue}`;
        return columnStr;
      })
      .join(', ');

    const foreignKeys = tableConfig.foreignKeys
      .map((foreignKey) => {
        const { column, referenceTable, referenceColumn, onUpdate, onDelete } = foreignKey;
        return `FOREIGN KEY ("${column}") REFERENCES "${referenceTable}" ("${referenceColumn}") ON UPDATE ${onUpdate} ON DELETE ${onDelete}`;
      })
      .join(', ');

    const indexes = tableConfig.indexes
      .map((index) => {
        const { column, unique, sorting } = index;
        const indexName = `${tableConfig.name}_${column}_index`;
        const sortOrder = sorting === 'ASC' ? '' : 'DESC';
        const uniqueStr = unique ? 'UNIQUE ' : '';
        return `CREATE ${uniqueStr}INDEX "${indexName}" ON "${tableConfig.name}" ("${column}" ${sortOrder})`;
      })
      .join(';\n');

    const uniqueColumns = tableConfig.columns
      .filter((column) => column.unique)
      .map((column) => `"${column.name}"`)
      .join(', ');

    const uniqueConstraints = uniqueColumns
      ? `ALTER TABLE "${tableConfig.name}" ADD CONSTRAINT "${tableConfig.name}_unique" UNIQUE (${uniqueColumns})`
      : '';

    return `
          CREATE TABLE "${tableConfig.name}" (${columns}${
      foreignKeys && foreignKeys.length > 0 ? `, ${foreignKeys}` : ''
    });
          ${indexes && indexes.length > 0 ? indexes + ';' : ''}
          ${uniqueConstraints && uniqueConstraints.length > 0 ? uniqueConstraints + ';' : ''}
        `.trim();
  });

  return createStatements.join('\n\n');
};

export default generateSchemaTablesSql;
