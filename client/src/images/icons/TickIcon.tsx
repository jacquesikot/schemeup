import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 20} height={props.height || 20} fill="none" {...props}>
    <path
      stroke={props.color || '#219653'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M16.667 5 7.5 14.167 3.333 10"
    />
  </svg>
);
export { SvgComponent as TickIcon };
