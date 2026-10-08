import { useAuthToken } from "@/lib/auth-store";
import { fetchUnreadCount } from "@/lib/api/notifications";
import { useEffect, useCallback, useSyncExternalStore } from "react";

const POLL_INTERVAL = 30000;

// Shared store: no matter how many components mount this hook (header badge,
// sidebar, notifications page), there is exactly one interval and one cached
// count instead of one poller per instance.
let sharedCount = 0;
let sharedToken: string | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

const getSnapshot = () => sharedCount;

function setCount(next: number) {
  if (next !== sharedCount) {
    sharedCount = next;
    for (const listener of listeners) listener();
  }
}

async function refreshNow(token: string | null) {
  if (!token) {
    setCount(0);
    return;
  }
  try {
    setCount(await fetchUnreadCount(token));
  } catch {
    // Silently fail — keep the last known count.
  }
}

function ensurePolling(token: string | null) {
  if (token !== sharedToken) {
    sharedToken = token;
    void refreshNow(token);
  }
  if (token && !pollTimer) {
    pollTimer = setInterval(() => void refreshNow(sharedToken), POLL_INTERVAL);
  } else if (!token && pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

export function useUnreadNotifications() {
  const token = useAuthToken();

  const subscribe = useCallback((listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const count = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    ensurePolling(token);
  }, [token]);

  const refresh = useCallback(async () => {
    await refreshNow(token);
  }, [token]);

  return { unreadCount: count, refresh };
}
