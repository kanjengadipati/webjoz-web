const STORAGE_CHANGE_EVENT = "webjoz-storage-change";

export function readStorageValue(key: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }
  return window.localStorage.getItem(key) || fallback;
}

export function subscribeToKeys(keys: string[], callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = (event: StorageEvent) => {
    if (!event.key || keys.includes(event.key)) {
      callback();
    }
  };

  window.addEventListener("storage", listener);
  window.addEventListener(STORAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(STORAGE_CHANGE_EVENT, callback);
  };
}

export function setStoredValue(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.removeItem(key);
  }
  window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
}
