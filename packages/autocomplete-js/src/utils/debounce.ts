export function debounce(fn: Function, time: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;

  return function (...args: unknown[]) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => fn(...args), time);
  };
}
