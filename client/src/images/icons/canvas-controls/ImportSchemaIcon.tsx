import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={56} height={56} fill="none" {...props}>
    <rect width={48} height={48} x={4} y={4} fill="#D1FADF" rx={24} />
    <path
      stroke="#039855"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m30 33 3-3-3-3m-4-4-3 3 3 3m-2.2 8h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C37 34.72 37 33.88 37 32.2v-8.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C34.72 19 33.88 19 32.2 19h-8.4c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C19 21.28 19 22.12 19 23.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C21.28 37 22.12 37 23.8 37Z"
    />
    <rect width={48} height={48} x={4} y={4} stroke="#ECFDF3" strokeWidth={8} rx={24} />
  </svg>
);
export { SvgComponent as ImportSchemaIcon };
