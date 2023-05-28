import * as React from "react";

const DownloadCloud = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={"18"}
      height={"18"}
      {...props}
    >
      <path d="M8 17l4 4 4-4M12 12v9" />
      <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
    </svg>
  );
}

export default DownloadCloud;
