import { AutocompleteClassNames } from '../types';

export function mergeClassNames(
  ...values: Array<Partial<AutocompleteClassNames>>
) {
  return values.reduce((acc, current) => {
    Object.keys(current).forEach((key) => {
      const accValue = acc[key];
      const currentValue = current[key];

      if (accValue !== currentValue) {
        acc[key] = [accValue, currentValue].filter(Boolean).join(' ');
      }
    });

    return acc;
  }, {});
}
