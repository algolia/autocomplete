import React, { useEffect, useState } from 'react';

import { ControlKeyIcon } from './icons/ControlKeyIcon';
import { SearchIcon } from './icons/SearchIcon';

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
      className="DocSearch DocSearch-Button"
      {...props}
      ref={ref}
    >
      <SearchIcon />
      <span className="DocSearch-Button-Placeholder">Search</span>

      <span className="DocSearch-Button-Key">
        {key === ACTION_KEY_DEFAULT ? <ControlKeyIcon /> : key}
      </span>
      <span className="DocSearch-Button-Key">K</span>
    </button>
  );
});
