import * as React from 'react';
import { SVGProps } from 'react';
const Pointer = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <path
      stroke="#9B51E0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M16.088 7.98c.514-.2.771-.3.843-.442a.416.416 0 0 0-.005-.388c-.076-.14-.335-.233-.854-.42L2.83 1.979c-.425-.153-.637-.23-.776-.181a.417.417 0 0 0-.257.257c-.048.14.028.351.18.776l4.754 13.242c.186.519.28.778.419.854.12.066.266.068.388.005.142-.072.242-.329.442-.843l2.164-5.565a.89.89 0 0 1 .089-.193.415.415 0 0 1 .097-.097.89.89 0 0 1 .193-.09l5.565-2.163Z"
    />
  </svg>
);
export default Pointer;
