import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" {...props}>
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.75 4.25h.006m-.006 3.5a3.5 3.5 0 1 0-3.469-3.03c.034.254.051.38.04.46a.497.497 0 0 1-.068.203c-.04.07-.11.14-.249.28l-2.98 2.98c-.102.101-.152.152-.188.21a.583.583 0 0 0-.07.17c-.016.066-.016.138-.016.28v1.014c0 .326 0 .49.064.614.056.11.145.2.255.255.124.064.288.064.614.064h1.014c.142 0 .214 0 .28-.016a.583.583 0 0 0 .17-.07c.058-.036.109-.086.21-.187l2.98-2.981c.14-.14.21-.21.28-.249a.498.498 0 0 1 .202-.068c.08-.011.207.006.46.04.154.02.311.031.471.031Z"
    />
  </svg>
);
export { SvgComponent as KeyIcon };
