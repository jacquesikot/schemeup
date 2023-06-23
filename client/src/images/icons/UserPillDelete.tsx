import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path stroke="#98A2B3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11 5-6 6m0-6 6 6" />
  </svg>
);
export { SvgComponent as UserPillDelete };
