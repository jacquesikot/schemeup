import { PostgresColumnType, typeColors } from '../types/tableTypes';
import removeModifier from './removeTypeModifier';

const getTypeColorCode = (type: PostgresColumnType): string => {
  const adjustedType = removeModifier(type);
  return typeColors[adjustedType];
};

export default getTypeColorCode;
