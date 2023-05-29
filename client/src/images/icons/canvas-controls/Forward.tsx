import * as React from 'react';
import { SVGProps } from 'react';
const Forward = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M16.667 5.833H8.333a5 5 0 1 0 0 10h8.334m0-10L13.333 2.5m3.334 3.333-3.334 3.334"
    />
  </svg>
);
export default Forward;
