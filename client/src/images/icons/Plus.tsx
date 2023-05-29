import { SVGProps } from 'react';
const TopBarPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width || 16} height={props.height || 16} fill="none" {...props}>
    <path
      stroke={props.color || '#7F56D9'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 1v14M1 8h14"
    />
  </svg>
);
export default TopBarPlus;
