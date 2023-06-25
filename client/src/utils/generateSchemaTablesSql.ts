// import { Table } from '../redux/slice/schemas';

// const generateSchemaTablesSql = (tableConfigs: Table[]) => {
//   const createStatements = tableConfigs.map((tableConfig) => {
//     const columns = tableConfig.columns
//       .map((column) => {
//         const { name, type, nullable, primaryKey, unique, autoInc, default: defaultValue } = column;
//         let columnStr = `"${name}" ${type}`;
//         if (!nullable) columnStr += ' NOT NULL';
//         if (primaryKey) columnStr += ' PRIMARY KEY';
//         if (unique) columnStr += ' UNIQUE';
//         if (autoInc) columnStr += ' GENERATED ALWAYS AS IDENTITY';
//         if (defaultValue !== undefined) columnStr += ` DEFAULT ${defaultValue}`;
//         return columnStr;
//       })
//       .join(', ');

//     const foreignKeys = tableConfig.foreignKeys
//       .map((foreignKey) => {
//         const { column, referenceTable, referenceColumn, onUpdate, onDelete } = foreignKey;
//         return `FOREIGN KEY ("${column}") REFERENCES "${referenceTable}" ("${referenceColumn}") ON UPDATE ${onUpdate} ON DELETE ${onDelete}`;
//       })
//       .join(', ');

//     const indexes = tableConfig.indexes
//       .map((index) => {
//         const { column, unique, sorting } = index;
//         const indexName = `${tableConfig.name}_${column}_index`;
//         const sortOrder = sorting === 'ASC' ? '' : 'DESC';
//         const uniqueStr = unique ? 'UNIQUE ' : '';
//         return `CREATE ${uniqueStr}INDEX "${indexName}" ON "${tableConfig.name}" ("${column}" ${sortOrder})`;
//       })
//       .join(';\n');

//     const uniqueColumns = tableConfig.columns
//       .filter((column) => column.unique)
//       .map((column) => `"${column.name}"`)
//       .join(', ');

//     const uniqueConstraints = uniqueColumns
//       ? `ALTER TABLE "${tableConfig.name}" ADD CONSTRAINT "${tableConfig.name}_unique" UNIQUE (${uniqueColumns})`
//       : '';

//     return `
//           CREATE TABLE "${tableConfig.name}" (${columns}${
//       foreignKeys && foreignKeys.length > 0 ? `, ${foreignKeys}` : ''
//     });
//           ${indexes && indexes.length > 0 ? indexes + ';' : ''}
//           ${uniqueConstraints && uniqueConstraints.length > 0 ? uniqueConstraints + ';' : ''}
//         `.trim();
//   });

//   return createStatements.join('\n\n');
// };

// export default generateSchemaTablesSql;

import { Table } from '../redux/slice/schemas';

const generateSchemaTablesSql = (tableConfigs: Table[]) => {
  console.log('tableConfigs', tableConfigs);
  const createStatements: any = [];
  const alterStatements: any = [];

  if (!Array.isArray(tableConfigs)) return '';

  tableConfigs.forEach((tableConfig) => {
    const columns = Array.isArray(tableConfig.columns)
      ? tableConfig.columns
          .map((column) => {
            const { name, type, nullable, primaryKey, unique, autoInc, default: defaultValue, autoUpdateTime } = column;
            let columnStr = `"${name}" ${type}`;
            if (!nullable) columnStr += ' NOT NULL';
            if (primaryKey) columnStr += ' PRIMARY KEY';
            if (unique) columnStr += ' UNIQUE';
            if (autoInc) columnStr += ' GENERATED ALWAYS AS IDENTITY';
            if (defaultValue !== undefined) {
              // Handle non-string default values
              columnStr += ` DEFAULT ${isNaN(Number(defaultValue)) ? `'${defaultValue}'` : defaultValue}`;
            }
            if (autoUpdateTime && defaultValue === undefined) {
              // only allow autoUpdateTime when default value is not defined
              columnStr += ` DEFAULT CURRENT_TIMESTAMP`;
            }
            return columnStr;
          })
          .join(', ')
      : '';

    createStatements.push(`CREATE TABLE "${tableConfig.name}" (${columns});`);

    const commentStatements: any = [];
    if (Array.isArray(tableConfig.columns)) {
      tableConfig.columns.forEach((column) => {
        if (column.comment !== undefined) {
          commentStatements.push(`COMMENT ON COLUMN "${tableConfig.name}"."${column.name}" IS '${column.comment}';`);
        }
      });
    }

    alterStatements.push(...commentStatements);

    const foreignKeys = Array.isArray(tableConfig.foreignKeys)
      ? tableConfig.foreignKeys.map((foreignKey) => {
          const { name, column, referenceTable, referenceColumn, onUpdate, onDelete } = foreignKey;
          return `ALTER TABLE "${tableConfig.name}" ADD CONSTRAINT "${name}" FOREIGN KEY ("${column}") REFERENCES "${referenceTable}" ("${referenceColumn}") ON UPDATE ${onUpdate} ON DELETE ${onDelete};`;
        })
      : [];

    alterStatements.push(...foreignKeys);

    const indexes = Array.isArray(tableConfig.columns)
      ? tableConfig.columns
          .filter((column) => column.index)
          .map((column) => {
            const indexName = `${tableConfig.name}_${column.name}_index`;
            return `CREATE INDEX "${indexName}" ON "${tableConfig.name}" ("${column.name}");`;
          })
      : [];

    alterStatements.push(...indexes);
  });

  return [...createStatements, ...alterStatements].join('\n');
};

export default generateSchemaTablesSql;
