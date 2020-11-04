import { isLocalStorageSupported } from './isLocalStorageSupported';

type LocalStorageProps = {
  key: string;
};

export function getLocalStorage<TItem>({ key }: LocalStorageProps) {
  if (!isLocalStorageSupported()) {
    return {
      setItem() {},
      getItem() {
        return [];
      },
    };
  }

  return {
    setItem(items: TItem[]) {
      return window.localStorage.setItem(key, JSON.stringify(items));
    },
    getItem(): TItem[] {
      const items = window.localStorage.getItem(key);

      return items ? (JSON.parse(items) as TItem[]) : [];
    },
  };
}
