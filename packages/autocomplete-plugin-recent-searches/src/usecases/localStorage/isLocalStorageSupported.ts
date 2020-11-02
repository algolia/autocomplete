import { LOCAL_STORAGE_KEY_TEST } from './constants';

export function isLocalStorageSupported() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TEST, '');
    localStorage.removeItem(LOCAL_STORAGE_KEY_TEST);

    return true;
  } catch (error) {
    return false;
  }
}
