import { PostgresColumnType } from '../types/tableTypes';

export default function removeModifier(inputString: string) {
  let regex = /^(.+?)(\(.+\))?$/;
  let result = inputString.match(regex);
  if (result) return result[1] as PostgresColumnType;
  return 'text' as PostgresColumnType;
}
