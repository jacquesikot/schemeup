import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={132} height={50} fill="none" {...props}>
    <path
      stroke="#D0D5DD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M124.999 6h-39.5C78.967 6 75.7 6 73.19 7.238a12 12 0 0 0-5.455 5.455C66.5 15.202 66.5 18.468 66.5 25v0c0 6.532 0 9.798-1.238 12.307a12 12 0 0 1-5.455 5.456C57.296 44 54.031 44 47.499 44h-39.5"
    />
    <circle cx={6.999} cy={44} r={5} fill="#1A1D1E" stroke="#9BA1A6" strokeWidth={2} />
    <circle cx={125.999} cy={6} r={5} fill="#1A1D1E" stroke="#9BA1A6" strokeWidth={2} />
  </svg>
);
export { SvgComponent as RelationLineIcon };
