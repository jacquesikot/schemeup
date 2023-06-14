import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" {...props}>
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 1.333v9.334M9.5 2.5l-7 7M10.667 6H1.333M9.5 9.5l-7-7"
    />
  </svg>
);
export { SvgComponent as UniqueIndexIcon };
