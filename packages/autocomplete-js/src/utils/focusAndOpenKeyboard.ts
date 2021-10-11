// Mobile devices don't open the keyboard when programmatically focusing inputs.
// See https://stackoverflow.com/a/55425845
export function focusAndOpenKeyboard(
  inputElement: HTMLInputElement,
  timeout: number = 100
) {
  if (inputElement) {
    const temp = document.createElement('input');
    const { top, left } = inputElement.getBoundingClientRect();

    temp.style.position = 'absolute';
    temp.style.top = `${top}px`;
    temp.style.left = `${left}px`;
    temp.style.height = '0';
    temp.style.opacity = '0';

    document.body.appendChild(temp);
    temp.focus();

    setTimeout(() => {
      inputElement.focus();
      inputElement.click();

      document.body.removeChild(temp);
    }, timeout);
  }
}
