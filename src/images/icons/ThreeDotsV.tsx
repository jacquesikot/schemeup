import * as React from 'react';
import { SVGProps } from 'react';
const ThreeDotsV = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 21} height={props.height || 21} fill="none" {...props}>
    <path
      stroke={props.color ? props.color : '#98A2B3'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M10.66 11.595a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM10.66 5.762a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM10.66 17.428a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666Z"
    />
  </svg>
);
export default ThreeDotsV;
