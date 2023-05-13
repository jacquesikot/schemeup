import * as React from 'react';
import { SVGProps } from 'react';
const TopBarX = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" {...props}>
    <path stroke="#9E77ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.667} d="M11 1 1 11M1 1l10 10" />
  </svg>
);
export default TopBarX;
