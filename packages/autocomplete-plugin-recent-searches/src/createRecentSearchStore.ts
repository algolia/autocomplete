function isLocalStorageSupported() {
  const key = '__TEST_KEY__';

  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);

    return true;
  } catch (error) {
    return false;
  }
}

function createStorage(key) {
  if (isLocalStorageSupported() === false) {
    return {
      setItem() {},
      getItem() {
        return [];
      },
    };
  }

  return {
    setItem(item) {
      return window.localStorage.setItem(key, JSON.stringify(item));
    },
    getItem() {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : [];
    },
  };
}

export function createRecentSearchStore({ key, limit = 5 }) {
  const storage = createStorage(key);
  let items = storage.getItem().slice(0, limit);

  return {
    add(item) {
      const isQueryAlreadySaved = items.findIndex(
        (x) => x.objectID === item.objectID
      );

      if (isQueryAlreadySaved > -1) {
        items.splice(isQueryAlreadySaved, 1);
      }

      items.unshift(item);
      items = items.slice(0, limit);

      storage.setItem(items);
    },
    remove(item) {
      items = items.filter((x) => x.objectID !== item.objectID);

      storage.setItem(items);
    },
    getAll() {
      return items;
    },
  };
}
