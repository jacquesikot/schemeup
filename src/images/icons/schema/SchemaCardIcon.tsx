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
      <rect width={32} height={32} x={2} y={2} stroke="#F9F5FF" strokeWidth={4} rx={16} />
    </g>
    <path
      stroke="#7F56D9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 10.216v3.304c0 .448 0 .672.087.843a.8.8 0 0 0 .35.35c.17.087.395.087.843.087h3.304m-2.984 4h-6.4m6.4 3.2h-6.4m1.6-6.4h-1.6M20 10h-4.16c-1.344 0-2.016 0-2.53.262a2.4 2.4 0 0 0-1.048 1.048C12 11.824 12 12.496 12 13.84v8.32c0 1.344 0 2.016.262 2.53a2.4 2.4 0 0 0 1.048 1.048c.514.262 1.186.262 2.53.262h5.12c1.344 0 2.016 0 2.53-.262a2.4 2.4 0 0 0 1.048-1.048c.262-.514.262-1.186.262-2.53V14.8L20 10Z"
    />
  </svg>
);
export default SchemaCardIcon;
