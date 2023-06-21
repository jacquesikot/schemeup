import { SVGProps } from 'react';

const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      width="20"
      height="20"
      {...props}
    >
      <path
        d="M4.16699 12.5001C3.39042 12.5001 3.00214 12.5001 2.69585 12.3732C2.28747 12.2041 1.96302 11.8796 1.79386 11.4712C1.66699 11.1649 1.66699 10.7767 1.66699 10.0001V4.33341C1.66699 3.39999 1.66699 2.93328 1.84865 2.57676C2.00844 2.26316 2.2634 2.00819 2.57701 1.8484C2.93353 1.66675 3.40024 1.66675 4.33366 1.66675H10.0003C10.7769 1.66675 11.1652 1.66675 11.4715 1.79362C11.8798 1.96277 12.2043 2.28723 12.3735 2.69561C12.5003 3.00189 12.5003 3.39018 12.5003 4.16675M10.167 18.3334H15.667C16.6004 18.3334 17.0671 18.3334 17.4236 18.1518C17.7372 17.992 17.9922 17.737 18.152 17.4234C18.3337 17.0669 18.3337 16.6002 18.3337 15.6667V10.1667C18.3337 9.23333 18.3337 8.76662 18.152 8.4101C17.9922 8.09649 17.7372 7.84153 17.4236 7.68174C17.0671 7.50008 16.6004 7.50008 15.667 7.50008H10.167C9.23357 7.50008 8.76686 7.50008 8.41034 7.68174C8.09674 7.84153 7.84177 8.09649 7.68198 8.4101C7.50033 8.76662 7.50033 9.23333 7.50033 10.1667V15.6667C7.50033 16.6002 7.50033 17.0669 7.68198 17.4234C7.84177 17.737 8.09674 17.992 8.41034 18.1518C8.76686 18.3334 9.23357 18.3334 10.167 18.3334Z"
        stroke="#344054"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CopyIcon;