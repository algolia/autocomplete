export function debounce(fn: Function, time: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function () {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(fn(), time);
  };
}
