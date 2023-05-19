import * as React from 'react';
import { SVGProps } from 'react';
const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <g clipPath="url(#a)">
      <path
        stroke="#344054"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7.333 2.667h-2.8c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.427-.218.988-.218 2.108v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218h5.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108v-2.8m-8 2H6.45c.326 0 .489 0 .642-.037.136-.033.266-.087.386-.16.134-.082.25-.198.48-.428l6.375-6.375a1.414 1.414 0 1 0-2-2L5.958 8.042c-.23.23-.346.346-.428.48-.073.12-.127.25-.16.386-.037.153-.037.316-.037.642v1.117Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default EditIcon;
