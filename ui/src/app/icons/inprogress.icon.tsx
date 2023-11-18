import React from "react";
import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

function InProgressSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48px"
        width="48px"
      fill="#22c55e"
      stroke="#22c55e"
      version="1.1"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path d="M23 24H1v-2h2.4c-1.6-5 1.6-7 3.7-8.4.9-.6 1.8-1.1 1.8-1.6s-.9-1.1-1.8-1.6C5 9 1.8 7.1 3.4 2H1V0h22v2h-2.4c1.6 5-1.6 7-3.7 8.4-1 .5-1.9 1.1-1.9 1.6s.9 1.1 1.8 1.6c2.1 1.4 5.3 3.4 3.7 8.4H23v2zM5.6 22h12.8c1.6-4-.5-5.3-2.6-6.7-1.4-.8-2.8-1.7-2.8-3.3 0-1.6 1.4-2.5 2.8-3.3C17.9 7.3 20 6 18.4 2H5.6C4 6 6.1 7.3 8.2 8.7c1.4.8 2.8 1.7 2.8 3.3 0 1.6-1.4 2.5-2.8 3.3C6.1 16.7 4 18 5.6 22z"></path>
          <path d="M16.8 23H7c-.3-1.5.2-2.4 2.3-4.3.8-.7 1.8-1.5 2.7-2.8 1 1.2 2 2.1 2.7 2.8 2.1 2 2.6 2.3 2.1 4.3zM9.4 6c-.7 1.3-.7 1.3.9 2.1.5.2 1.1.5 1.6.9.5-.4 1.2-.7 1.6-.9 1.7-.8 1.7-.8 1-2.1"></path>
        </g>
      </g>
    </svg>
  );
}

export default InProgressSvg;

export const InProgressIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={InProgressSvg} {...props} />
);
