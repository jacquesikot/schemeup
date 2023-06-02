import { postgresColumnTypes } from '../lib/columnTypes';

export const handler = async (event) => {
  function extractCreateTableStatementsFromDump(sqlDump: string): string[] {
    const createTableRegex = /CREATE TABLE[^;]+;/gi;
    const createTableStatements = sqlDump.match(createTableRegex) || [];
    return createTableStatements;
  }

  function extractAlterTableStatementsFromDump(sqlDump: string): string[] {
    const alterTableRegex = /ALTER TABLE[^;]+;/gi;
    const alterTableStatements = sqlDump.match(alterTableRegex) || [];
    return alterTableStatements;
  }

  function parseCreateTableStatements(createTableStatements: string[]) {
    const parsedStatements: any = [];

    for (const createTableStatement of createTableStatements) {
      const cleanedStatement = createTableStatement.replace(/[\r\n]+/g, '').trim();

      const tableNameRegex = /CREATE TABLE\s+((\w+\.\w+)|(\w+\."\w+"))/i;
      const tableNameMatch = cleanedStatement.match(tableNameRegex);
      const tableName = tableNameMatch ? tableNameMatch[1] : '';

      const columnDefinitions: string[] = [];

      // Extract the column definitions between '(' and ')'
      const startIndex = cleanedStatement.indexOf('(') + 1;
      const endIndex = cleanedStatement.lastIndexOf(')');
      const columnDefs = cleanedStatement.substring(startIndex, endIndex).trim();

      // Split the column definitions by comma, while accounting for the numeric(x,y) data type
      let openParenthesisCount = 0;
      let currentColumnDef = '';

      for (let i = 0; i < columnDefs.length; i++) {
        const char = columnDefs[i];

        if (char === '(') {
          openParenthesisCount++;
        } else if (char === ')') {
          openParenthesisCount--;
        }

        if (char === ',' && openParenthesisCount === 0) {
          // Push the current column definition and reset
          columnDefinitions.push(currentColumnDef.trim());
          currentColumnDef = '';
        } else {
          currentColumnDef += char;
        }
      }

      // Push the last column definition
      columnDefinitions.push(currentColumnDef.trim());

      const alterStatements = extractAlterTableStatementsFromDump(event.body);
      const foreignKeysFromAlterStatements = extractForeignKeysFromAlterStatements(alterStatements);
      const foreignKeysFromCreateStatement = extractForeignKeysFromCreateStatements(createStatements);
      const indexFromSqlDump = parseIndexFromSql(event.body);

      parsedStatements.push({
        tableName,
        columns: columnDefinitions.map((d) => parseColumnDefinition(d)),
        foreignKeys: [],
        indexes: [],
      });

      foreignKeysFromAlterStatements.map((fk) => {
        const table = parsedStatements.find((t) => t.tableName === fk.tableName);
        if (table) {
          // check if the foreign key already exists
          const existingForeignKey = table.foreignKeys.find((f) => f.columnName === fk.columnName);
          if (existingForeignKey) {
            // if the foreign key already exists, add the reference table to the existing foreign key
            existingForeignKey.referenceTable = fk.referenceTable;
          } else {
            table.foreignKeys.push(fk);
          }
        }
      });

      foreignKeysFromCreateStatement.map((fk) => {
        const table = parsedStatements.find((t) => t.tableName === fk.tableName);
        if (table) {
          // check if the foreign key already exists
          const existingForeignKey = table.foreignKeys.find((f) => f.columnName === fk.columnName);
          if (existingForeignKey) {
            // if the foreign key already exists, add the reference table to the existing foreign key
            existingForeignKey.referenceTable = fk.referenceTable;
          } else {
            table.foreignKeys.push(fk);
          }
        }
      });

      indexFromSqlDump.map((index) => {
        const table = parsedStatements.find((t) => t.tableName === index.tableName);
        if (table) {
          // check if the foreign key already exists
          const existingIndex = table.indexes.find((f) => f.indexName === index.indexName);
          if (existingIndex) {
            // if the foreign key already exists, add the reference table to the existing foreign key
            existingIndex.indexColumns = index.indexColumns;
          } else {
            table.indexes.push(index);
          }
        }
      });
    }

    return parsedStatements;
  }

  function findMatch(inputString, searchArray) {
    let longestMatch = '';

    for (let i = 0; i < searchArray.length; i++) {
      const regex = new RegExp(searchArray[i] + '\\b[^\\s]*', 'i');
      const match = inputString.match(regex);

      if (match && (!longestMatch || match[0].length > longestMatch.length)) {
        longestMatch = match[0];
      }
    }

    return longestMatch;
  }

  function parseColumnDefinition(columnDefinition: string) {
    let columnName = columnDefinition.split(' ')[0];
    let columnType;
    let nullable;
    let defaultValue = '';
    let autoInc = false;
    const columnNameValue = columnDefinition.split(' ')[0];
    if (columnNameValue.toLowerCase() === 'primary') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'foreign') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'constraint') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'check') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'unique') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'index') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'using') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'tablespace') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'inherits') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'with') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'options') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'storage') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'collate') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'default') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'generated') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'identity') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'always') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'as') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'stored') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'virtual') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'on') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'delete') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'update') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'references') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'match') {
      return undefined;
    } else if (columnNameValue.toLowerCase() === 'partial') {
      return undefined;
    } else {
      columnName = columnNameValue;
    }

    columnType = findMatch(columnDefinition, postgresColumnTypes);

    // Check if the column is nullable
    if (columnDefinition.toLowerCase().includes('not null')) {
      nullable = false;
    } else {
      nullable = true;
    }

    // Extract the default value if it exists
    const defaultMatch = columnDefinition.toLowerCase().match(/default\s+(.*?)\s+/);
    if (defaultMatch && defaultMatch.length > 1) {
      defaultValue = defaultMatch[1].toUpperCase();
    }

    // Check if the column has auto-increment
    const autoIncrementRegex = /\b(auto_increment|serial|identity\b(?!.*_(number|identity)))\b/;
    if (autoIncrementRegex.test(columnDefinition.toLowerCase())) {
      autoInc = true;
    }

    const parsedColumn = {
      columnName,
      dataType: columnType,
      nullable,
      defaultValue,
      autoInc,
    };

    if (parsedColumn.columnName) return parsedColumn;
  }

  function extractForeignKeysFromAlterStatements(statements: string[]) {
    let result: any = [];

    statements.forEach((statement) => {
      // Convert to lower case, remove line breaks, extra spaces
      let cleanedStatement = statement.toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      // Check if the statement is a foreign key constraint
      if (cleanedStatement.includes('add constraint') && cleanedStatement.includes('foreign key')) {
        let tableNameMatch = cleanedStatement.match(/alter table only (.*?) add constraint/);
        let fkNameMatch = cleanedStatement.match(/add constraint (.*?) foreign key/);
        let columnNameMatch = cleanedStatement.match(/foreign key \((.*?)\) references/);
        let referenceTableMatch = cleanedStatement.match(/references (.*?)\(/);
        let referenceColumnMatch = cleanedStatement.match(/references .*?\((.*?)\)/);
        let onUpdateMatch = cleanedStatement.match(/on update (cascade|set null|set default|no action)/);
        let onDeleteMatch = cleanedStatement.match(/on delete (cascade|set null|set default|no action)/);

        if (tableNameMatch && fkNameMatch && columnNameMatch && referenceTableMatch && referenceColumnMatch) {
          let tableName = tableNameMatch[1];
          let fkName = fkNameMatch[1];
          let columnName = columnNameMatch[1];
          let referenceTable = referenceTableMatch[1];
          let referenceColumn = referenceColumnMatch[1];
          let onUpdate = onUpdateMatch ? onUpdateMatch[1] : null;
          let onDelete = onDeleteMatch ? onDeleteMatch[1] : null;

          // Check if the table is already in the result
          let table = result.find((t) => t.tableName === tableName);
          if (!table) {
            table = {
              tableName: tableName,
              foreignKeys: [],
            };
            result.push(table);
          }

          // Add the foreign key to the table
          table.foreignKeys.push({
            fkName: fkName,
            columnName: columnName,
            referenceTable: referenceTable,
            referenceColumn: referenceColumn,
            onUpdate: onUpdate,
            onDelete: onDelete,
          });
        }
      }
    });

    return result;
  }

  function extractForeignKeysFromCreateStatements(dump) {
    const foreignKeyInfo: any = [];

    createStatements.forEach((statement) => {
      // Clean up the statement
      statement = statement.toLowerCase();
      statement = statement.replace(/\s+/g, ' ');
      statement = statement.replace(/[\r\n]+/g, '');
      statement = statement.replace(/"/g, '');

      // Extract table name
      const tableNameMatch = statement.match(/create table (\w+\.\w+)/);
      const tableName = tableNameMatch ? tableNameMatch[1] : 'NO TABLE NAME';

      // Match foreign key constraints
      const foreignKeyRegex =
        /(constraint (\w+) )?foreign key \((\w+)\) references (\w+\.\w+)( \((\w+)\))?( on delete (cascade|set null|no action|restrict|set default))?( on update (cascade|set null|no action|restrict|set default))?/g;
      let match;
      const foreignKeys: any = [];
      while ((match = foreignKeyRegex.exec(statement)) !== null) {
        const foreignKey = {
          fkName: match[2] || 'NO NAME',
          columnName: match[3],
          referenceTable: match[4],
          referenceColumn: match[6] || 'NO COLUMN',
          onDelete: match[8] || 'NO ACTION',
          onUpdate: match[10] || 'NO ACTION',
        };
        foreignKeys.push(foreignKey);
      }

      // Add table and its foreign keys to the result
      if (foreignKeys.length > 0) {
        foreignKeyInfo.push({
          tableName: tableName,
          foreignKeys: foreignKeys,
        });
      }
    });

    return foreignKeyInfo;
  }

  function parseIndexFromSql(sql) {
    // Convert to lower case, remove quotes, and remove extra white space and line breaks
    sql = sql.toLowerCase().replace(/"/g, '').replace(/\s+/g, ' ').trim();

    // Split the SQL into individual statements
    const statements = sql.split(';');

    // Initialize the result object
    let result = {};

    // Regular expression to parse the index statements
    let indexRegex = /create (unique )?index (.*?) on (.*?) using (.*?) \((.*?)\)/;

    // Process each statement
    for (let statement of statements) {
      let match = statement.match(indexRegex);
      if (match) {
        let unique = Boolean(match[1]);
        let indexName = match[2];
        let tableName = match[3];
        let indexType = match[4];
        let column = match[5];

        // Create an object for the table if it doesn't exist
        if (!result[tableName]) {
          result[tableName] = { tableName: tableName, indexes: [] };
        }

        // Add the index to the table object
        result[tableName].indexes.push({
          column: column,
          unique: unique,
          sorting: indexType,
        });
      }
    }

    // Convert the result object to an array of table objects
    result = Object.values(result);

    return result as any[];
  }

  const createStatements = extractCreateTableStatementsFromDump(event.body);
  const columnDefinitions = parseCreateTableStatements(createStatements);

  let response: any;

  response = columnDefinitions;

  return {
    statusCode: 200,
    body: JSON.stringify({
      response,
    }),
  };
};
