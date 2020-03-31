import React, { useState, useEffect } from 'react';

interface SearchButtonProps {
  onClick(): void;
}

const ACTION_KEY_DEFAULT = 'Ctrl';
const ACTION_KEY_APPLE = '⌘';

function isAppleDevice() {
  if (typeof navigator === 'undefined') {
    return ACTION_KEY_DEFAULT;
  }

  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export function SearchButton(props: SearchButtonProps) {
  const [key, setKey] = useState(() =>
    isAppleDevice() ? ACTION_KEY_APPLE : ACTION_KEY_DEFAULT
  );

  useEffect(() => {
    if (isAppleDevice()) {
      setKey(ACTION_KEY_APPLE);
    }
  }, []);

  return (
    <button
      type="button"
      className="DocSearch-SearchButton"
      onClick={props.onClick}
    >
      <svg
        className="DocSearch-SearchButton-Icon"
        width={18}
        viewBox="0 0 18 18"
      >
        <path
          d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
          stroke="currentColor"
          strokeWidth="1.78"
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>

      <span className="DocSearch-SearchButton-Placeholder">Search</span>

      <span className="DocSearch-SearchButton-Key">{key}</span>
      <span className="DocSearch-SearchButton-Key">K</span>
    </button>
  );
}
