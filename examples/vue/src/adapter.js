import { h } from 'vue';

export function createElement(type, props, ...children) {
  const adaptedProps = Object.entries(props || {}).reduce(
    (acc, [key, value]) => {
      // Vue 3 accepts lower-case event names so we need to transform props like
      // `onMouseMove` to `onMousemove`.
      const property =
        key[0] === 'o' && key[1] === 'n'
          ? key.slice(0, 3) + key.slice(3).toLowerCase()
          : key;

      acc[property] = value;
      return acc;
    },
    {}
  );

  return h(type, adaptedProps, ...children);
}
