import * as React from 'react';
import { SVGProps } from 'react';
const TrashIconPlain = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      stroke="#F04438"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.667 4v-.533c0-.747 0-1.12-.146-1.406a1.333 1.333 0 0 0-.582-.582c-.286-.146-.659-.146-1.406-.146H7.467c-.747 0-1.12 0-1.406.146-.25.128-.455.331-.582.582-.146.286-.146.659-.146 1.406V4M2 4h12m-1.333 0v7.467c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874c-.428.218-.988.218-2.108.218H6.533c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108V4"
    />
  </svg>
);
export default TrashIconPlain;
