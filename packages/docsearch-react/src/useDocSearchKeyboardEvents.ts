import React from 'react';

export function useDocSearchKeyboardEvents({ isOpen, onOpen, onClose }) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.keyCode === 27 && isOpen) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose]);
}
