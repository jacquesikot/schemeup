const parsePgDumpParser = (sql: string) => {
  interface Column {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
    unique: boolean;
    comment?: string;
    index?: boolean;
  }

  interface ForeignKey {
    name: string;
    column: string;
    referenceTable: string;
    referenceColumn: string;
    onUpdate: string;
    onDelete: string;
  }

  interface Index {
    column: string;
    unique: boolean;
    sorting: string;
  }

  interface Table {
    name?: string;
    columns?: Column[];
    foreignKeys?: ForeignKey[];
    indexes?: Index[];
  }

  let sqlDump = sql;

  // Remove single line comments
  sqlDump = sql.replace(/--.*$/gm, '');

  // Remove multi-line comments
  sqlDump = sqlDump.replace(/\/\*[\s\S]*?\*\//gm, '');

  sqlDump = sqlDump.replace(/"/g, '');

  // Remove line breaks, leading/trailing white spaces, and convert to lowercase
  let cleanedStatements = sqlDump.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

  // Split the cleaned content on the semicolon character
  let statements: string[] = cleanedStatements.split(';');

  // Remove any empty strings in the array
  statements = statements.filter((stmt) => stmt.trim() !== '');

  let schema: Table[] = [];

  function getCreateStatements(sqlStatements: string[]): string[] {
    const createTableStatements = sqlStatements.filter((statement) => {
      const createTableRegex = /CREATE TABLE[^;]+/gi;
      return createTableRegex.test(statement);
    });
    return createTableStatements;
  }

  function getColumnDefinitions(createStatement: string): string[] {
    const columnDefinitions: string[] = [];

    // Extract the column definitions between '(' and ')'
    const startIndex = createStatement.indexOf('(') + 1;
    const endIndex = createStatement.lastIndexOf(')');
    let columnDefs = createStatement.substring(startIndex, endIndex).trim();
    const iterableColumnDefs = Array.from(columnDefs);

    for (const columnDef of iterableColumnDefs) {
      const columnNameValue = columnDef.split(' ')[0];
      if (columnNameValue.toLowerCase() === 'primary') {
        // remove the column def from columnDefs
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'foreign') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'constraint') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'check') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'unique') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'index') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'using') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'tablespace') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'inherits') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'with') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'options') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'storage') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'collate') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'default') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'generated') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'identity') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'always') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'as') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'stored') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'virtual') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'on') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'delete') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'update') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'references') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'match') {
        columnDefs = columnDefs.replace(columnDef, '');
      } else if (columnNameValue.toLowerCase() === 'partial') {
        columnDefs = columnDefs.replace(columnDef, '');
      }
    }

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

    return columnDefinitions;
  }

  function parseColumnDefinition(columnDefinitions: string[]): Column[] {
    return columnDefinitions.map((columnDef) => {
      let name: string = '';
      let type: string = '';

      // If columnDef contains a quoted name, handle it separately.
      if (columnDef.startsWith('"')) {
        const match = columnDef.match(/^"([^"]*)"\s+(.*)/);
        if (match) {
          name = match[1];
          type = match[2].split(' ')[0];
        }
      } else {
        const columnDefParts = columnDef.split(' ');
        name = columnDefParts[0];
        type = columnDefParts[1];
      }

      const nullable = !columnDef.includes('not null');
      const primaryKey = columnDef.includes('primary key');
      const unique = columnDef.includes('unique');
      const commentRegex = /comment\s+'(.*)'/i;
      const commentMatch = columnDef.match(commentRegex);
      const comment = commentMatch ? commentMatch[1] : undefined;
      const index = columnDef.includes('index');
      const defaultRegex = /default\s+(.*)/i;
      const defaultMatch = columnDef.match(defaultRegex);
      const defaultValue = defaultMatch ? defaultMatch[1] : undefined;

      return {
        name,
        type,
        nullable,
        primaryKey,
        unique,
        comment,
        index,
        default: defaultValue,
      };
    });
  }

  function getAlterStatements(dump: string): string[] {
    const alterTableRegex = /alter table[^;]+;/gi;
    const alterTableStatements = sqlDump.match(alterTableRegex) || [];
    return alterTableStatements;
  }

  // function parseForignKeyFromAlterStatement(statements: string[]) {
  //   let result: {
  //     tableName: string;
  //     foreignKeys: ForeignKey[];
  //   }[] = [];

  //   statements.forEach((statement) => {
  //     // Clean the statement
  //     let cleanedStatement = statement.toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  //     // Check if the statement is a foreign key constraint
  //     if (cleanedStatement.includes('add constraint') && cleanedStatement.includes('foreign key')) {
  //       let tableNameMatch = cleanedStatement.match(/alter table only (.*?) add constraint/);
  //       let fkNameMatch = cleanedStatement.match(/add constraint (.*?) foreign key/);
  //       let columnNameMatch = cleanedStatement.match(/foreign key \((.*?)\) references/);
  //       let referenceTableMatch = cleanedStatement.match(/references (.*?)\(/);
  //       let referenceColumnMatch = cleanedStatement.match(/references .*?\((.*?)\)/);
  //       let onUpdateMatch = cleanedStatement.match(/on update (cascade|set null|set default|no action)/);
  //       let onDeleteMatch = cleanedStatement.match(/on delete (cascade|set null|set default|no action)/);

  //       if (tableNameMatch && fkNameMatch && columnNameMatch && referenceTableMatch && referenceColumnMatch) {
  //         let tableName = tableNameMatch[1];
  //         let fkName = fkNameMatch[1];
  //         let columnName = columnNameMatch[1];
  //         let referenceTable = referenceTableMatch[1];
  //         let referenceColumn = referenceColumnMatch[1];
  //         let onUpdate = onUpdateMatch ? onUpdateMatch[1] : 'NO ACTION';
  //         let onDelete = onDeleteMatch ? onDeleteMatch[1] : 'NO ACTION';

  //         // Check if the table is already in the result
  //         let table = result.find((t) => t.tableName === tableName);
  //         if (!table) {
  //           table = {
  //             tableName: tableName,
  //             foreignKeys: [],
  //           };
  //           result.push(table);
  //         }

  //         // Add the foreign key to the table
  //         table.foreignKeys.push({
  //           name: fkName,
  //           column: columnName,
  //           referenceTable: referenceTable,
  //           referenceColumn: referenceColumn,
  //           onUpdate: onUpdate,
  //           onDelete: onDelete,
  //         });
  //       }
  //     }
  //   });

  //   return result;
  // }

  function parseForeignKeyFromCreateStatement(statements: string[]) {
    let foreignKeyInfo: {
      tableName: string;
      foreignKeys: ForeignKey[];
    }[] = [];

    statements.forEach((statement) => {
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
      const foreignKeys: ForeignKey[] = [];
      while ((match = foreignKeyRegex.exec(statement)) !== null) {
        const foreignKey: ForeignKey = {
          name: '',
          column: match[3] || '',
          referenceTable: match[4] || '',
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

  function parseIndexFromSql(sql: string) {
    // Convert to lower case, remove quotes, and remove extra white space and line breaks
    sql = sql.toLowerCase().replace(/"/g, '').replace(/\s+/g, ' ').trim();

    // Split the SQL into individual statements
    const statements = sql.split(';');

    // Initialize the result object
    let result: any = {};

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

  function handleParse(createStatements: string[]): Table[] {
    const parsedStatements: Table[] = [];

    for (const statement of createStatements) {
      //   const tableNameRegex = /CREATE TABLE\s+((\w+\.\w+)|(\w+\."\w+"))/i;
      const tableNameRegex = /CREATE\s+TABLE\s+((("[^"]+")|(\w+))(\.("[^"]+")|\.(\w+))?)/i;

      const tableNameMatch = statement.match(tableNameRegex);
      const tableName = tableNameMatch ? tableNameMatch[1] : '';

      // Parse columns
      const columnDefinitions = getColumnDefinitions(statement);
      const parsedColumn = parseColumnDefinition(columnDefinitions);
      const alterStatements = getAlterStatements(sql);

      // const parsedForeignKeysFromAlterStatememts = parseForignKeyFromAlterStatement(alterStatements);
      const parsedForeignKeysFromCreateStatement = parseForeignKeyFromCreateStatement(createStatements);

      // const allForeignKeys = parsedForeignKeysFromAlterStatememts.concat(parsedForeignKeysFromCreateStatement);

      const parsedIndexStatements = parseIndexFromSql(sql);

      parsedStatements.push({
        name: tableName,
        columns: parsedColumn,
        foreignKeys: [],
        indexes: parsedIndexStatements.find((index) => index.tableName === tableName)?.indexes || [],
      });
    }

    schema = parsedStatements;
    return parsedStatements;
  }

  function parseFk(sql: string, res: Table[]): any[] {
    // Clean up the statements
    const cleanedStatements = sql
      .toLowerCase()
      .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
      .replace(/"/g, ''); // remove quotes

    // Regex to match the ALTER TABLE statements
    // const regex = /alter table\s+(\w+)\s+add constraint \w+ foreign key\((\w+)\) references (\w+)\((\w+)\)/g;
    const regex = /alter table\s+(\w+)\s+add constraint (\w+) foreign key\((\w+)\) references (\w+)\((\w+)\)/g;

    const foreignKeys: any = [];
    let match;

    // Loop over the matches
    while ((match = regex.exec(cleanedStatements)) !== null) {
      foreignKeys.push({
        table: match[1],
        constraintName: match[2],
        column: match[3],
        referenceTable: match[4],
        referenceColumn: match[5],
        onUpdate: 'NO ACTION', // Defaulting to 'NO ACTION' as it's not specified in the ALTER TABLE statements
        onDelete: 'NO ACTION', // Defaulting to 'NO ACTION' as it's not specified in the ALTER TABLE statements
      });
    }

    // Loop over foreignKeys and add them to res array where the table name matches

    let newData: any = [...res];

    foreignKeys.forEach((fk) => {
      res.forEach((table, index) => {
        if (table.name === fk.table) {
          newData[index].foreignKeys.push({
            column: fk.column,
            referenceTable: fk.referenceTable,
            referenceColumn: fk.referenceColumn,
            onUpdate: fk.onUpdate,
            onDelete: fk.onDelete,
            name: fk.constraintName,
          });
        }
      });
    });

    return newData;
  }

  const createStatements = getCreateStatements(statements);
  const parsedData = handleParse(createStatements);

  return parseFk(sql, parsedData);
};

export default parsePgDumpParser;
