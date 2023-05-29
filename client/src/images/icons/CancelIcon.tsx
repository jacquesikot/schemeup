import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 20} height={props.height || 20} fill="none" {...props}>
    <path
      stroke={props.color || '#EB5757'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M15 5 5 15M5 5l10 10"
    />
  </svg>
);
export { SvgComponent as CancelIcon };
