import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={57} height={56} fill="none" {...props}>
    <rect width={48} height={48} x={4.5} y={4} fill="#FEE4E2" rx={24} />
    <path
      stroke="#D92D20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M32.5 22v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C30.98 18 30.42 18 29.3 18h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.428-.218.988-.218 2.108v.8m2 5.5v5m4-5v5M19.5 22h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C33.22 38 32.38 38 30.7 38h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C21.5 35.72 21.5 34.88 21.5 33.2V22"
    />
    <rect width={48} height={48} x={4.5} y={4} stroke="#FEF3F2" strokeWidth={8} rx={24} />
  </svg>
);
export { SvgComponent as DeleteModalIcon };
