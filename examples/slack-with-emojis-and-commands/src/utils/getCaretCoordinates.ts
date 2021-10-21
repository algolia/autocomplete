import textareaCaret from 'textarea-caret';

export function getCaretCoordinates(inputRef: HTMLTextAreaElement | null) {
  return inputRef
    ? textareaCaret(inputRef, inputRef?.selectionEnd)
    : { top: 0, height: 0 };
}
