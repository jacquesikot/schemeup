export type PostgresColumnType =
  | 'int'
  | 'integer'
  | 'bigint'
  | 'smallint'
  | 'decimal'
  | 'numeric'
  | 'real'
  | 'double precision'
  | 'serial'
  | 'bigserial'
  | 'money'
  | 'character varying'
  | 'varchar'
  | 'character'
  | 'char'
  | 'text'
  | 'bytea'
  | 'timestamp without time zone'
  | 'timestamp with time zone'
  | 'date'
  | 'time without time zone'
  | 'time with time zone'
  | 'interval'
  | 'boolean'
  | 'enum'
  | 'uuid'
  | 'json'
  | 'jsonb'
  | 'xml'
  | 'tsvector'
  | 'tsquery'
  | 'point'
  | 'line'
  | 'lseg'
  | 'box'
  | 'path'
  | 'polygon'
  | 'circle'
  | 'cidr'
  | 'inet'
  | 'macaddr'
  | 'bit'
  | 'bit varying'
  | 'hstore'
  | 'ltree'
  | 'ltxtquery'
  | 'ltxtquery_with_rc'
  | 'ltxtquery_with_pos'
  | 'ltxtquery_with_tr'
  | 'ltxtquery_with_trsp'
  | 'ltxtquery_with_trgr'
  | 'ltxtquery_with_trgr_no_r'
  | 'ltxtquery_with_trgr_no_r_c'
  | 'ltxtquery_with_trgr_no_r_cp'
  | 'ltxtquery_with_trgr_no_r_cpr'
  | 'ltxtquery_with_trgr_no_r_cprs'
  | 'ltxtquery_with_trgr_no_r_cprst'
  | 'ltxtquery_with_trgr_no_r_cprstr'
  | 'ltxtquery_with_trgr_no_r_cprstri'
  | 'ltxtquery_with_trgr_no_r_cprstrin'
  | 'ltxtquery_with_trgr_no_r_cprstring'
  | 'ltxtquery_with_trgr_no_r_cprstringe'
  | 'ltxtquery_with_trgr_no_r_cprstringes'
  | 'ltxtquery_with_trgr_no_r_cprstringesr'
  | 'ltxtquery_with_trgr_no_r_cprstringesrg'
  | 'ltxtquery_with_trgr_no_r_cprstringesrgu'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguy'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguyc'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguyco'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycom'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycoma'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycomam'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycomama'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycomamat'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycomamatt'
  | 'ltxtquery_with_trgr_no_r_cprstringesrguycomamattw';

export type PostgresOnUpdateOption = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';

export type PostgresOnDeleteOption = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';

export type PostgresIndexSorting =
  | 'ASC'
  | 'DESC'
  | 'ASC NULLS FIRST'
  | 'ASC NULLS LAST'
  | 'DESC NULLS FIRST'
  | 'DESC NULLS LAST';

export const typeColors: Record<PostgresColumnType, string> = {
  int: '#363F72',
  integer: '#66CC66',
  bigint: '#6666FF',
  smallint: '#FFCC66',
  decimal: '#CC66CC',
  numeric: '#66CCCC',
  real: '#CCCCCC',
  'double precision': '#666666',
  serial: '#336699',
  bigserial: '#993366',
  money: '#9966CC',
  'character varying': '#3399CC',
  varchar: '#99CC66',
  character: '#FFCC99',
  char: '#CC3366',
  text: '#3399CC',
  bytea: '#99CC66',
  'timestamp without time zone': '#CC99CC',
  'timestamp with time zone': '#CC99FF',
  date: '#FF9933',
  'time without time zone': '#FF6633',
  'time with time zone': '#33CCFF',
  interval: '#66CCFF',
  boolean: '#FF99CC',
  enum: '#CCCCCC',
  uuid: '#33FF99',
  json: '#FF3366',
  jsonb: '#3366FF',
  xml: '#FFCC33',
  tsvector: '#FFCC66',
  tsquery: '#FF6666',
  point: '#66CC66',
  line: '#FFCC33',
  lseg: '#33CC99',
  box: '#CC33CC',
  path: '#99CC33',
  polygon: '#CC3366',
  circle: '#FF6699',
  cidr: '#CCFF99',
  inet: '#FFCCCC',
  macaddr: '#FF6699',
  bit: '#FF6699',
  'bit varying': '#33CC99',
  hstore: '#CCFFCC',
  ltree: '#33CCFF',
  ltxtquery: '#FF99FF',

  ltxtquery_with_rc: '',
  ltxtquery_with_pos: '',
  ltxtquery_with_tr: '',
  ltxtquery_with_trsp: '',
  ltxtquery_with_trgr: '',
  ltxtquery_with_trgr_no_r: '',
  ltxtquery_with_trgr_no_r_c: '',
  ltxtquery_with_trgr_no_r_cp: '',
  ltxtquery_with_trgr_no_r_cpr: '',
  ltxtquery_with_trgr_no_r_cprs: '',
  ltxtquery_with_trgr_no_r_cprst: '',
  ltxtquery_with_trgr_no_r_cprstr: '',
  ltxtquery_with_trgr_no_r_cprstri: '',
  ltxtquery_with_trgr_no_r_cprstrin: '',
  ltxtquery_with_trgr_no_r_cprstring: '',
  ltxtquery_with_trgr_no_r_cprstringe: '',
  ltxtquery_with_trgr_no_r_cprstringes: '',
  ltxtquery_with_trgr_no_r_cprstringesr: '',
  ltxtquery_with_trgr_no_r_cprstringesrg: '',
  ltxtquery_with_trgr_no_r_cprstringesrgu: '',
  ltxtquery_with_trgr_no_r_cprstringesrguy: '',
  ltxtquery_with_trgr_no_r_cprstringesrguyc: '',
  ltxtquery_with_trgr_no_r_cprstringesrguyco: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycom: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycoma: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycomam: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycomama: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycomamat: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycomamatt: '',
  ltxtquery_with_trgr_no_r_cprstringesrguycomamattw: '',
};
