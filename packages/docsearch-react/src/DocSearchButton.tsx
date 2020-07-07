import React, { useState, useEffect } from 'react';

import { SearchIcon } from './icons/SearchIcon';
import { ControlKeyIcon } from './icons/ControlKeyIcon';

const ACTION_KEY_DEFAULT = 'Ctrl';
const ACTION_KEY_APPLE = '⌘';

function isAppleDevice() {
  if (typeof navigator === 'undefined') {
    return ACTION_KEY_DEFAULT;
  }

  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const DocSearchButton = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>((props, ref) => {
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
      {...props}
      ref={ref}
    >
      <SearchIcon />
      <span className="DocSearch-SearchButton-Placeholder">Search</span>

      <span className="DocSearch-SearchButton-Key">
        {key === ACTION_KEY_DEFAULT ? <ControlKeyIcon /> : key}
      </span>
      <span className="DocSearch-SearchButton-Key">K</span>
    </button>
  );
});
