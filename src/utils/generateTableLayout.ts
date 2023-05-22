import { TABLE_WIDTH } from '../components/canvas/CanvasTable';
import { Table } from '../redux/slice/schemas';

interface Coordinate {
  x: number;
  y: number;
}

interface TableLayout {
  [tableId: string]: Coordinate;
}

const generateTableLayout = (schema: Table[]): TableLayout => {
  const tableLayout: TableLayout = {};
  const tableWidth = TABLE_WIDTH; // Adjust the width of each table square
  const padding = 50; // Adjust the spacing between tables

  let currentX = padding;
  let currentY = padding;

  const referencedTableLayout: TableLayout = {};

  // Calculate x and y coordinates for each table
  for (const table of schema) {
    const tableHeight = 40 * table.columns.length;

    tableLayout[table.id] = { x: currentX, y: currentY };

    currentX += tableWidth + padding;

    // If the currentX exceeds the available width, move to the next row
    if (currentX + tableWidth + padding > window.innerWidth) {
      currentX = padding;
      currentY += tableHeight + padding;
    }
  }

  // Generate coordinates for foreign key connections
  for (const table of schema) {
    for (const foreignKey of table.foreignKeys) {
      const { x: startX, y: startY } = tableLayout[table.id];
      const referencedTable = tableLayout[foreignKey.referenceTable];

      if (referencedTable) {
        const { x: endX, y: endY } = referencedTable;

        // Adjust the coordinates for the foreign key connection
        const offsetX = tableWidth; // Adjust the horizontal offset between tables
        const offsetY = (endY + startY) / 2; // Use the average of the start and end Y coordinates

        // Store the adjusted coordinates for the foreign key connection
        tableLayout[`${table.id}_${foreignKey.referenceTable}`] = { x: startX + offsetX, y: offsetY };

        // Store the referenced table's layout for swapping later
        referencedTableLayout[foreignKey.referenceTable] = referencedTable;
      }
    }
  }

  // Swap the X coordinates of tables with foreign keys
  for (const table of schema) {
    if (table.foreignKeys.length > 0) {
      const referencedTableId = table.foreignKeys[0].referenceTable;

      if (tableLayout[table.id] && referencedTableLayout[table.id]) {
        const startX = tableLayout[table.id].x;
        const endX = referencedTableLayout[table.id].x;

        tableLayout[table.id].x = endX;
        tableLayout[referencedTableId].x = startX;
      }
    }
  }

  return tableLayout;
};

export default generateTableLayout;
