import * as React from 'react';
import { SVGProps } from 'react';
const Settings = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M3.167 16.5v-5m0 0a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Zm0-6.667V1.5M9 16.5v-5m0-6.667V1.5m0 3.333a1.667 1.667 0 1 0 0 3.334 1.667 1.667 0 0 0 0-3.334ZM14.833 16.5v-3.333m0 0a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334Zm0-6.667v-5"
    />
  </svg>
);
export default Settings;
