import React from "react";

function AvatarBot1() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      fill="none"
      viewBox="0 0 120 120"
    >
      <mask id="viewboxMask">
        <rect width="120" height="120" fill="#fff" rx="0" ry="0"></rect>
      </mask>
      <g mask="url(#viewboxMask)">
        <path fill="#43a047" d="M0 0H120V120H0z"></path>
        <g fill="#000" fillOpacity="0.6" transform="translate(22 68)">
          <rect width="4" height="8" x="12" y="12" rx="2"></rect>
          <rect width="4" height="8" x="36" y="12" rx="2"></rect>
          <rect width="4" height="8" x="24" y="12" rx="2"></rect>
          <rect width="4" height="8" x="48" y="12" rx="2"></rect>
          <rect width="4" height="8" x="60" y="12" rx="2"></rect>
        </g>
        <g transform="translate(8 20)">
          <path
            fill="#000"
            fillOpacity="0.8"
            d="M0 10a8 8 0 018-8h88a8 8 0 018 8v18a8 8 0 01-8 8H82.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2.47 2.12-5.15 4.4-8.24 4.4H38.67c-3.14 0-5.94-2.12-8.62-4.16-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0021.02 36H8a8 8 0 01-8-8V10z"
          ></path>
          <mask
            id="eyesShade01-a"
            style={{ maskType: "alpha" }}
            width="104"
            height="42"
            x="0"
            y="2"
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="#000"
              fillOpacity="0.8"
              d="M0 10a8 8 0 018-8h88a8 8 0 018 8v18a8 8 0 01-8 8H82.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2.47 2.12-5.15 4.4-8.24 4.4H38.67c-3.14 0-5.94-2.12-8.62-4.16-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0021.02 36H8a8 8 0 01-8-8V10z"
            ></path>
          </mask>
          <g mask="url(#eyesShade01-a)">
            <path
              fill="#FF3D3D"
              d="M12 19a5 5 0 015-5h70a5 5 0 015 5v2a5 5 0 01-5 5H74.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2 1.72-4.14 3.54-6.52 4.18V34H46.67c-3.14 0-5.94-2.13-8.62-4.17-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0029.02 26H17a5 5 0 01-5-5v-2z"
            ></path>
            <path
              fill="#fff"
              fillOpacity="0.2"
              d="M12 44L32-2h-4L8 44h4zM50-2H39L19 44h11L50-2z"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default AvatarBot1;