import { useAuthToken } from "@/lib/auth-store";
import { fetchUnreadCount } from "@/lib/api/notifications";
import { useState, useEffect, useCallback, useRef } from "react";

const POLL_INTERVAL = 30000;

export function useUnreadNotifications() {
  const token = useAuthToken();
  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }
    try {
      const c = await fetchUnreadCount(token);
      setCount(c);
    } catch {
      // Silently fail
    }
  }, [token]);

  useEffect(() => {
    void refresh();
    intervalRef.current = setInterval(() => void refresh(), POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return { unreadCount: count, refresh };
}
