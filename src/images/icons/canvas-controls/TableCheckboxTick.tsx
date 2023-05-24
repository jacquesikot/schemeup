import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={9} height={8} fill="none" {...props}>
    <path
      stroke="#7F56D9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M7 2.125 3.562 5.563 2 4"
    />
  </svg>
);
export { SvgComponent as TableCheckboxTick };
