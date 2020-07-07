import React from 'react';

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  searchButtonRef,
}) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.keyCode === 27 && isOpen) ||
        // The `Cmd+K` shortcut both opens and closes the modal.
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        // The `/` shortcut opens but doesn't close the modal because it's
        // a character.
        (event.key === '/' && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }

      if (searchButtonRef.current === document.activeElement) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose, searchButtonRef]);
}
