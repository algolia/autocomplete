import { LOCAL_STORAGE_KEY_TEST } from './constants';

function isLocalStorageSupported() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TEST, '');
    localStorage.removeItem(LOCAL_STORAGE_KEY_TEST);

    return true;
  } catch (error) {
    return false;
  }
}

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
