import React from 'react';

export function SourceIcon(props: { type: string }) {
  switch (props.type) {
    case 'lvl1':
      return <LvlIcon />;
    case 'content':
      return <ContentIcon />;
    default:
      return <AnchorIcon />;
  }
}

function LvlIcon() {
  return (
    <svg width="20" height="20">
      <path
        d="M17 6h-4-1V1l5 5v11l-1 2H4l-1-1V2l1-1h8l5 5z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnchorIcon() {
  return (
    <svg width="20" height="20">
      <path
        d="M13 13h4-4V8H7v5h6v4-4H7V8H3h4V3v5h6V3v5h4-4v5zm-6 0v4-4H3h4z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg width="20" height="20">
      <path
        d="M17 5H3h14zm0 5H3h14zm0 5H3h14z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}
