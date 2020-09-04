export function debounce(fn: Function, time: number) {
  let timerId: number | undefined = undefined;

  return function () {
    clearTimeout(timerId);
    timerId = (setTimeout(fn, time) as unknown) as number;
  };
}
