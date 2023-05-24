import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#7F56D9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 4.167v11.666M4.167 10h11.666"
    />
  </svg>
);
export { SvgComponent as NewRowPlus };
