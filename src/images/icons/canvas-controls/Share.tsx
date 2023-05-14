import * as React from 'react';
import { SVGProps } from 'react';
const Share = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="m7.158 11.258 5.692 3.317m-.008-9.15L7.158 8.742M17.5 4.167a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM7.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10 5.833a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
    />
  </svg>
);
export default Share;
