import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      stroke="#6941C6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M9 12.245v-3.2m0-3.2h.008M17 9.045a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
    />
  </svg>
);
export { SvgComponent as SchemaTemplateIcon };
