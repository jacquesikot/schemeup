import { TABLE_WIDTH } from '../components/canvas/CanvasTable';
import { Table } from '../redux/slice/schemas';

interface TableCoordinates {
  id: string;
  x: number;
  y: number;
}

const generateTableLayout = (tables: Table[]): TableCoordinates[] => {
  const coordinates: TableCoordinates[] = [];
  const tableMap: Map<string, Table> = new Map();

  // Create a map of tables using their IDs for easy lookup
  for (const table of tables) {
    tableMap.set(table.id, table);
  }

  // Calculate the initial coordinates for each table
  let x = 50;
  let y = 50;

  for (const table of tables) {
    const { id } = table;
    const foreignKeys = table.foreignKeys ? table.foreignKeys.map((fk) => fk.referenceTable) : [];
    const targetTable = tableMap.get(id);

    if (!targetTable) {
      continue;
    }

    // Adjust the x-coordinate based on the number of foreign keys
    const numForeignKeys = foreignKeys.length;
    const xOffset = numForeignKeys * -100; // Adjust the spacing between tables with foreign keys
    const tableWidth = TABLE_WIDTH; // Fixed width for each table
    const tableHeight = 40 * targetTable.columns.length;

    coordinates.push({ id, x, y });

    x += tableWidth + xOffset;
    y += tableHeight + 100; // Adjust the vertical spacing between tables
  }

  // Adjust the y-coordinate for tables with foreign keys to place them on the left
  for (const table of tables) {
    const { id } = table;
    const foreignKeys = table.foreignKeys ? table.foreignKeys.map((fk) => fk.referenceTable) : [];

    for (const fk of foreignKeys) {
      const sourceTable = tableMap.get(fk);

      if (!sourceTable) {
        continue;
      }

      const sourceCoord = coordinates.find((coord) => coord.id === fk);
      const targetCoord = coordinates.find((coord) => coord.id === id);

      if (sourceCoord && targetCoord) {
        const sourceY = sourceCoord.y;
        const targetY = targetCoord.y;
        const xOffset = -300; // Adjust the horizontal spacing between tables with foreign keys

        if (sourceY === targetY && sourceCoord.x > targetCoord.x) {
          // Adjust the x-coordinate for tables on the same row
          targetCoord.x = sourceCoord.x + xOffset;
        } else if (sourceY > targetY) {
          // Adjust the y-coordinate for tables on different rows
          targetCoord.y = sourceY;
          targetCoord.x = sourceCoord.x + xOffset;
        }
      }
    }
  }

  return coordinates;
};

export default generateTableLayout;
