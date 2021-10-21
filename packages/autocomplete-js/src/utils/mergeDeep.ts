const isPlainObject = (value: unknown) =>
  value &&
  typeof value === 'object' &&
  Object.prototype.toString.call(value) === '[object Object]';

export function mergeDeep(...values: any[]) {
  return values.reduce((acc, current) => {
    Object.keys(current).forEach((key) => {
      const accValue = acc[key];
      const currentValue = current[key];

      if (Array.isArray(accValue) && Array.isArray(currentValue)) {
        acc[key] = accValue.concat(...currentValue);
      } else if (isPlainObject(accValue) && isPlainObject(currentValue)) {
        acc[key] = mergeDeep(accValue, currentValue);
      } else {
        acc[key] = currentValue;
      }
    });

    return acc;
  }, {});
}
