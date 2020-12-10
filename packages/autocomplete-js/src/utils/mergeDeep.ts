const isObject = (value: unknown) => value && typeof value === 'object';

export function mergeDeep(...objects: any[]) {
  return objects.reduce((acc, current) => {
    Object.keys(current).forEach((key) => {
      const accValue = acc[key];
      const currentValue = current[key];

      if (Array.isArray(accValue) && Array.isArray(currentValue)) {
        acc[key] = accValue.concat(...currentValue);
      } else if (isObject(accValue) && isObject(currentValue)) {
        acc[key] = mergeDeep(accValue, currentValue);
      } else {
        acc[key] = currentValue;
      }
    });

    return acc;
  }, {});
}
