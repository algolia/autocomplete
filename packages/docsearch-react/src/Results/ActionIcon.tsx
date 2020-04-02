import React from 'react';

export function SelectIcon() {
  return (
    <svg width="20" height="20">
      <g
        stroke="currentColor"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 3v4c0 2-2 4-4 4H2" />
        <path d="M8 17l-6-6 6-6" />
      </g>
    </svg>
  );
}

export function GoToExternal() {
  return (
    <svg width="20" height="20">
      <path
        d="M5 6v9h9v-3a1 1 0 112 0v4l-1 1H4l-1-1V5l1-1h4a1 1 0 110 2H5zm5 5a1 1 0 11-1-1l5-6h-3a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 11-2 0V6l-6 5z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}
