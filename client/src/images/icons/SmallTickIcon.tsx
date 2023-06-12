import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={8} fill="none" {...props}>
    <path stroke="#7F56D9" strokeLinecap="round" strokeLinejoin="round" d="M10.667.5 4.25 6.917 1.333 4" />
  </svg>
);
export { SvgComponent as SmallTickIcon };
