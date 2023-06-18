import * as React from 'react';
import { SVGProps } from 'react';
const ImportIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6.667 13.333 10 10m0 0 3.333 3.333M10 10v7.5m6.666-3.548a4.583 4.583 0 0 0-2.917-8.12.516.516 0 0 1-.444-.25 6.25 6.25 0 1 0-9.816 7.58"
    />
  </svg>
);
export default ImportIcon;
