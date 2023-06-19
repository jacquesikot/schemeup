import React from "react";

const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      style={{position: "absolute", right: 10, top: 14}}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#667085"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default ArrowDown;


