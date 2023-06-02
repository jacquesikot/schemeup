import { TABLE_WIDTH } from '../components/canvas/CanvasTable';
import { Table } from '../redux/slice/schemas';

interface TableCoordinates {
  id: string;
  x: number;
  y: number;
}

const generateTableLayout = (tables: Table[]): TableCoordinates[] => {
  const padding = 20;
  const screenWidth = window.innerWidth * 2;
  const adjustedTables = tables.map((table) => {
    return {
      id: table.id,
      width: TABLE_WIDTH,
      height: table.columns.length * 44,
    };
  });

  let x = 0;
  let y = 0;
  let maxHeightInRow = 0;

  return adjustedTables.map((table) => {
    // Check if table fits in the remaining width, if not move to next row
    if (x + table.width + padding > screenWidth) {
      x = 0;
      y += maxHeightInRow + padding;
      maxHeightInRow = 0;
    }

    const result = { ...table, x, y };

    // Update x position and max height for this row
    x += table.width + padding;
    maxHeightInRow = Math.max(maxHeightInRow, table.height);

    return result;
  });
};

export default generateTableLayout;
