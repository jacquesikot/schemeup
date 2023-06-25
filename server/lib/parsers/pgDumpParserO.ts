import natural from 'natural';
import PostgresColumnTypes from '../../utils/postgresColumnTypes';

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
    primaryKey: boolean;
  }

  interface Table {
    name?: string;
    columns?: Column[];
    foreignKeys?: ForeignKey[];
    indexes?: Index[];
  }

  interface TableDefinition {
    table: string;
    columns: Column[];
  }

  const schema: Table[] = [];

  function cleanSqlDump(sql: string): string[] {
    let sqlDump = sql;

    // Remove single line comments
    sqlDump = sqlDump.replace(/--.*$/gm, '');

    // Remove multi-line comments
    sqlDump = sqlDump.replace(/\/\*[\s\S]*?\*\//gm, '');

    // Preserve string literals enclosed in single quotes
    let literals: string[] = [];
    sqlDump = sqlDump.replace(/'([^']*)'/g, (_match, g1) => {
      literals.push(g1);
      return `$$${literals.length - 1}$$`;
    });

    // Convert to lowercase outside of literals
    sqlDump = sqlDump.toLowerCase();

    // Restore literals
    sqlDump = sqlDump.replace(/\$\$([0-9]+)\$\$/g, (_match, g1) => `'${literals[Number(g1)]}'`);

    // Remove line breaks and excessive white spaces
    let cleanedStatements = sqlDump.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Split the cleaned content on the semicolon character
    let statements: string[] = cleanedStatements.split(';');

    // Remove any empty strings in the array
    statements = statements.filter((stmt) => stmt.trim() !== '');

    return statements;
  }

  function extractCreateTableStatements(statements: string[]): string[] {
    const createTableRegex = /^\s*create table\s+/i;
    return statements.filter((stmt) => createTableRegex.test(stmt));
  }

  function extractAlterTableStatements(statements: string[]): string[] {
    const alterTableRegex = /^\s*alter table\s+/i;
    return statements.filter((stmt) => alterTableRegex.test(stmt));
  }

  // create index
  // create unique index
  // add index

  function extractCreateIndexStatements(statements: string[]): string[] {
    const createIndexRegex = /^\s*create index\s+/i;
    return statements.filter((stmt) => createIndexRegex.test(stmt));
  }

  function extractCommentOnStatements(statements: string[]): string[] {
    const commentOnRegex = /^\s*comment on\s+/i;
    return statements.filter((stmt) => commentOnRegex.test(stmt));
  }

  function extractCreateSequenceStatements(statements: string[]): string[] {
    const createSequenceRegex = /^\s*create sequence\s+/i;
    return statements.filter((stmt) => createSequenceRegex.test(stmt));
  }

  function extractTableNames(statements: string[]): string[] {
    const tableNames = statements.map((stmt) => {
      // Match anything that is not a whitespace or an opening parenthesis after "create table", possibly prefixed by any word (the schema name) and a dot
      const match = stmt.match(/create table (?:\w+\.)?(.*?)\s*\(/i);
      return match ? match[1] : '';
    });

    return tableNames.filter((name) => name !== '');
  }

  function findClosestPostgresType(inputString) {
    let maxSimilarity = 0;
    let closestType = '';

    PostgresColumnTypes.forEach((type) => {
      let similarity = natural.JaroWinklerDistance(inputString, type, {});

      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        closestType = type;
      }
    });

    return closestType;
  }

  function parseCreateTableColumns(createTableStatement: string): TableDefinition | null {
    const tableNameMatch = createTableStatement.match(/create table (?:\w+\.)?(.*?)\s*\(/i);
    if (!tableNameMatch) {
      return null;
    }

    const tableNameRaw = tableNameMatch[1];
    const tableName = tableNameRaw ? tableNameRaw.replace(/"/g, '') : '';

    const columnDefinitions: string[] = [];

    // Extract the column definitions between '(' and ')'
    const startIndex = createTableStatement.indexOf('(') + 1;
    const endIndex = createTableStatement.lastIndexOf(')');
    let columnDefs = createTableStatement.substring(startIndex, endIndex).trim();
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

    const columnData: Column[] = columnDefinitions.map((columnDef) => {
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
      const defaultRegex = /default\s+(.*)/i;
      const defaultMatch = columnDef.match(defaultRegex);
      const defaultValue = defaultMatch ? defaultMatch[1] : undefined;

      return {
        name,
        type: findClosestPostgresType(type),
        nullable,
        primaryKey,
        index: false,
        unique,
        comment,
        default: defaultValue,
      };
    });

    return {
      table: tableName,
      columns: columnData,
    };
  }

  function parseFK(alterStatements: string[]) {
    const regex =
      /alter table\s+"?(.*?)"?\s+add constraint\s+"?(.*?)"?\s+foreign key\s*\(\s*"(.*?)"?\s*\)\s*references\s+"?(.*?)"?\s*\(\s*"(.*?)"?\s*\)/gi;

    const foreignKeys: any = [];
    let match;

    for (let statement of alterStatements) {
      // Loop over the matches
      while ((match = regex.exec(statement)) !== null) {
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
    }

    return foreignKeys;
  }

  function parsePrimaryKeysFromAlter(alterStatements: string[]) {
    const regex = /alter table\s+"?(.*?)"?\s+add primary key\s*\(\s*"(.*?)"?\s*\)/gi;

    const primaryKeys: any = [];
    let match;

    for (let statement of alterStatements) {
      // Loop over the matches
      while ((match = regex.exec(statement)) !== null) {
        primaryKeys.push({
          table: match[1],
          indexes: [
            {
              column: match[2],
              unique: true,
              sorting: 'ASC', // Assuming default is 'ASC' for primary keys
              primaryKey: true,
            },
          ],
        });
      }
    }

    return primaryKeys;
  }

  function parsePrimaryKeysFromCreate(createTableStatements: string[]) {
    const regex = /create table\s+"?(.*?)"?\s+\(\s*([^]*?)primary key\s*\(\s*"(.*?)"?\s*\)/gi;

    const primaryKeys: any = [];
    let match;

    for (let statement of createTableStatements) {
      // Loop over the matches
      while ((match = regex.exec(statement)) !== null) {
        primaryKeys.push({
          table: match[1],
          indexes: [
            {
              column: match[3],
              unique: true,
              sorting: 'ASC', // Assuming default is 'ASC' for primary keys
              primaryKey: true,
            },
          ],
        });
      }
    }

    return primaryKeys;
  }

  function parseUniqueIndexesFromAlter(alterStatements: string[]) {
    const uniqueIndexRegex1 = /alter table\s+"?(.*?)"?\s+add unique\s*\(\s*"(.*?)"?\s*\)/gi;
    const uniqueIndexRegex2 = /alter table\s+"?(.*?)"?\s+add constraint\s+"?(.*?)"?\s+unique\s*\(\s*"(.*?)"?\s*\)/gi;

    const uniqueIndexes: any = [];

    for (let statement of alterStatements) {
      let match;
      while ((match = uniqueIndexRegex1.exec(statement)) !== null) {
        const tableName = match[1];
        const columnName = match[2];
        const index: Index = {
          column: columnName,
          unique: true,
          sorting: 'ASC', // Defaulting to 'ASC' as it's not specified in the ALTER TABLE statements
          primaryKey: false, // Defaulting to 'false' as it's not specified in the ALTER TABLE statements
        };

        let tableIndex = uniqueIndexes.find((x) => x.table === tableName);
        if (tableIndex) {
          tableIndex.indexes.push(index);
        } else {
          uniqueIndexes.push({
            table: tableName,
            indexes: [index],
          });
        }
      }

      while ((match = uniqueIndexRegex2.exec(statement)) !== null) {
        const tableName = match[1];
        const columnName = match[3];
        const index: Index = {
          column: columnName,
          unique: true,
          sorting: 'ASC', // Defaulting to 'ASC' as it's not specified in the ALTER TABLE statements
          primaryKey: false, // Defaulting to 'false' as it's not specified in the ALTER TABLE statements
        };

        let tableIndex = uniqueIndexes.find((x) => x.table === tableName);
        if (tableIndex) {
          tableIndex.indexes.push(index);
        } else {
          uniqueIndexes.push({
            table: tableName,
            indexes: [index],
          });
        }
      }
    }

    return uniqueIndexes;
  }

  function parseCreateIndexStatements(createIndexStatements: string[]) {
    let responses: any[] = [];

    createIndexStatements.forEach((statement: string) => {
      // regex to parse the statement
      const regex = /create index \"(.*)\" on \"(.*)\"\(\"(.*)\"\)/i;
      const match = statement.match(regex);

      if (!match) {
        throw new Error(`Invalid statement: ${statement}`);
      }

      // get the indexName, tableName, and columnName from the regex match
      const indexName = match[1];
      const tableName = match[2];
      const columnName = match[3];

      let index: Index = {
        column: columnName,
        unique: false, // This would have to be parsed from the statement if available
        sorting: 'ASC', // This would have to be parsed from the statement if available
        primaryKey: false, // This would have to be parsed from the statement if available
      };

      let response = {
        table: tableName,
        indexes: [index],
      };

      responses.push(response);
    });

    return responses;
  }

  const cleanedStatements = cleanSqlDump(sql);
  const createTableStatements = extractCreateTableStatements(cleanedStatements);
  const alterTableStatements = extractAlterTableStatements(cleanedStatements);
  const createIndexStatements = extractCreateIndexStatements(cleanedStatements);
  const commentOnStatements = extractCommentOnStatements(cleanedStatements);
  const createSequenceStatements = extractCreateSequenceStatements(cleanedStatements);

  // Parse create table statements
  const parsedCreateTableColumns = createTableStatements.map(parseCreateTableColumns).filter(Boolean);

  // Parse alter table statements
  const parsedForeignKeys = parseFK(alterTableStatements);

  // Parse primary keys from alter table statements
  const parsedPrimaryKeysFromAlter = parsePrimaryKeysFromAlter(alterTableStatements);
  const parsedPrimaryKeysFromCreate = parsePrimaryKeysFromCreate(createTableStatements);

  //Parse unique indexes from alter table statements
  const parsedUniqueIndexesFromAlter = parseUniqueIndexesFromAlter(alterTableStatements);

  // Parse create index statements
  const parsedIndexes = parseCreateIndexStatements(createIndexStatements);

  // Create schema structure using table names
  extractTableNames(createTableStatements).map((tableName) => {
    schema.push({
      name: tableName.replace(/"/g, ''),
      columns: [],
      foreignKeys: [],
      indexes: [],
    });
  });

  // Add columns to schema
  parsedCreateTableColumns.forEach((table) => {
    if (table) {
      const schemaTable = schema.find((s) => s.name === table.table);
      if (schemaTable) {
        schemaTable.columns = table.columns;
      }
    }
  });

  // Add foreign keys to schema
  parsedForeignKeys.forEach((fk) => {
    const schemaTable = schema.find((s) => s.name === fk.table);
    if (schemaTable) {
      if (schemaTable.foreignKeys) {
        schemaTable.foreignKeys.push(fk);
      }
    }
  });

  // Add primary keys from alter to schema
  parsedPrimaryKeysFromAlter.forEach((pk) => {
    const schemaTable = schema.find((s) => s.name === pk.table);
    if (schemaTable) {
      if (schemaTable.columns) {
        // find column index in table by name
        const columnIndex = schemaTable.columns.findIndex((column) => {
          return pk.indexes.find((index) => index.column === column.name);
        });

        if (columnIndex !== -1) {
          schemaTable.columns[columnIndex].primaryKey = true;
        }
      }
    }
  });

  // Add primary keys from create to schema
  parsedPrimaryKeysFromCreate.forEach((pk) => {
    const schemaTable = schema.find((s) => s.name === pk.table);
    if (schemaTable) {
      if (schemaTable.columns) {
        // find column index in table by name
        const columnIndex = schemaTable.columns.findIndex((column) => {
          return pk.indexes.find((index) => index.column === column.name);
        });

        if (columnIndex !== -1) {
          schemaTable.columns[columnIndex].primaryKey = true;
        }
      }
    }
  });

  // Add unique indexes from alter to schema
  parsedUniqueIndexesFromAlter.forEach((index) => {
    const schemaTable = schema.find((s) => s.name === index.table);
    if (schemaTable) {
      if (schemaTable.columns) {
        // find column index in table by name
        const columnIndex = schemaTable.columns.findIndex((column) => {
          return index.indexes.find((index) => index.column === column.name);
        });

        if (columnIndex !== -1) {
          schemaTable.columns[columnIndex].unique = true;

          // ensure the indexes array exists
          schemaTable.indexes = schemaTable.indexes || [];
          schemaTable.indexes.push({
            column: schemaTable.columns[columnIndex].name,
            unique: true,
            sorting: 'ASC', // default sorting
            primaryKey: false, // this is not a primary key
          });
        }
      }
    }
  });

  // Add indexes to schema
  parsedIndexes.forEach((index) => {
    const schemaTable = schema.find((s) => s.name === index.table);
    if (schemaTable) {
      if (schemaTable.columns) {
        // find column index in table by name
        const columnIndex = schemaTable.columns.findIndex((column) => {
          return index.indexes.find((index) => index.column === column.name);
        });

        if (columnIndex !== -1) {
          schemaTable.columns[columnIndex].index = true;

          // ensure the indexes array exists
          schemaTable.indexes = schemaTable.indexes || [];
          schemaTable.indexes.push({
            column: schemaTable.columns[columnIndex].name,
            unique: false, // this is not unique
            sorting: 'ASC', // default sorting
            primaryKey: false, // this is not a primary key
          });
        }
      }
    }
  });

  return schema;
};

export default parsePgDumpParser;
