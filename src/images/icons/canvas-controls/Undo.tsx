import * as React from 'react';
import { SVGProps } from 'react';
const Undo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M3.333 5.833h8.334a5 5 0 0 1 0 10H3.333m0-10L6.667 2.5M3.333 5.833l3.334 3.334"
    />
  </svg>
);
export default Undo;
