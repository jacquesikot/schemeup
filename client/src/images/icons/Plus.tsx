import { SVGProps } from 'react';
const TopBarPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} fill="none" {...props}>
    <path
      stroke={props.color || '#fff'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M10.5 4.167v11.666M4.667 10h11.666"
    />
  </svg>
);
export default TopBarPlus;
