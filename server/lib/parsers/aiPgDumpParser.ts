import { Configuration, OpenAIApi } from 'openai';

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

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

interface DumpData {
  createStatements: string[];
  alterStatements: string[];
  createIndexStatements: string[];
  commentOnStatements: string[];
}

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

const parseCreateTableSql = async (sql: string) => {
  const prompt = `
  ${sql}
  You are a software engineer working on a database migration tool. 
  You are given the postgres sql statement above that creates a table. You need to parse the sql statement and convert it to a json object. 
  The json object will be used to create a table in a different database. 
  The json object should have the Table interface:  
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

  The response should be a json object that has the Table interface only

  Response:
    `;
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.data.choices[0].message?.content;
};
const parseAlterTableSql = async (sql: string) => {
  const prompt = `
    ${sql}
    You are a software engineer working on a database migration tool. 
    You are given the postgres sql statement above that alter a table. You need to parse the sql statement and convert it to a json object. 
    The json object will be used to alter a table in a different database. 
    The json object should have the Table interface:  
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
  
    The response should be a json object that has the Table interface only
  
    Response:
      `;
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.data.choices[0].message?.content;
};

function mergeTables(existingTable: Table, newTable: Table): Table {
  return {
    name: newTable.name || existingTable.name,
    columns: newTable.columns || existingTable.columns,
    foreignKeys: newTable.foreignKeys || existingTable.foreignKeys,
    indexes: newTable.indexes || existingTable.indexes,
  };
}

export async function postgreAiSqlParser(dump: string) {
  let tablesMap = new Map<string, Table>();

  const cleanedStatements = cleanSqlDump(dump);

  const createTableStatements = extractCreateTableStatements(cleanedStatements);
  const alterTableStatements = extractAlterTableStatements(cleanedStatements);

  for (const createTableStatement of createTableStatements) {
    const createTable = await parseCreateTableSql(createTableStatement);
    if (createTable) {
      const createTableJson = JSON.parse(createTable);
      if (createTableJson.name) {
        if (tablesMap.has(createTableJson.name)) {
          const existingTable = tablesMap.get(createTableJson.name)!;
          tablesMap.set(createTableJson.name, mergeTables(existingTable, createTableJson));
        } else {
          tablesMap.set(createTableJson.name, createTableJson);
        }
      }
    }

    for (const alterTableStatement of alterTableStatements) {
      const alterTable = await parseAlterTableSql(alterTableStatement);
      if (alterTable) {
        const alterTableJson = JSON.parse(alterTable);
        if (alterTableJson.name) {
          if (tablesMap.has(alterTableJson.name)) {
            const existingTable = tablesMap.get(alterTableJson.name)!;
            tablesMap.set(alterTableJson.name, mergeTables(existingTable, alterTableJson));
          } else {
            tablesMap.set(alterTableJson.name, alterTableJson);
          }
        }
      }
    }
  }

  return Array.from(tablesMap.values());
}
