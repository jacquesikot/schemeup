import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#4B535F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M17.5 17.5h-15M15 9.167l-5 5m0 0-5-5m5 5V2.5"
    />
  </svg>
);
export { SvgComponent as DownloadIcon };
