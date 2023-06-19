import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#076839"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M10 13.333V10m0-3.333h.008M18.333 10a8.333 8.333 0 1 1-16.666 0 8.333 8.333 0 0 1 16.666 0Z"
    />
  </svg>
);
export { SvgComponent as SuggestionInfoIcon };
