export function defer<TValue>(fn: () => TValue, timeout: number) {
  return new Promise<TValue>((resolve) => {
    setTimeout(() => resolve(fn()), timeout);
  });
}
