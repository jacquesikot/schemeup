import * as React from 'react';
import { SVGProps } from 'react';
const SchemaCardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} fill="none" {...props}>
    <g
      style={{
        mixBlendMode: 'multiply',
      }}
    >
      <rect width={32} height={32} x={2} y={2} fill="#F4EBFF" rx={16} />
      <path
        stroke="#7F56D9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
        d="M24 13.333c0 1.105-2.686 2-6 2s-6-.895-6-2m12 0c0-1.104-2.686-2-6-2s-6 .896-6 2m12 0v9.334c0 1.106-2.667 2-6 2s-6-.894-6-2v-9.334M24 18c0 1.107-2.667 2-6 2s-6-.893-6-2"
      />
      <rect width={32} height={32} x={2} y={2} stroke="#F9F5FF" strokeWidth={4} rx={16} />
    </g>
  </svg>
);
export default SchemaCardIcon;
