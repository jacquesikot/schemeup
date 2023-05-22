import { PostgresColumnType, typeColors } from '../types/tableTypes';

const getTypeColorCode = (type: PostgresColumnType): string => {
  return typeColors[type];
};

export default getTypeColorCode;
