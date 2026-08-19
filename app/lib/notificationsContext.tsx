/*
  Notification state, shared across every dashboard tab.

  This lives in a provider mounted once in the dashboard layout rather than in
  each consumer, for two reasons:

    1. The bell badge and the toast stack read the same list. Two independent
       fetches would drift apart the moment one marked something read.
    2. Dismissing a toast has to stick across navigation. Tabs unmount when you
       switch between them, so per-component state would resurrect every toast
       on every tab change — exactly the behavior a dismiss button promises not
       to have.

  Fetching happens once per mount (login or refresh), per the "no realtime"
  decision — there is no subscription or polling here.
*/

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "./db";
import { isSupabaseConfigured } from "./supabase";

type NotificationsValue = {
  items: NotificationRow[];
  unread: NotificationRow[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  /** Unread items still queued to pop as toasts this session. */
  toasts: NotificationRow[];
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

/** How many toasts stack at once. Beyond this the rest wait in the bell panel. */
const MAX_TOASTS = 3;

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Toast visibility is session state, not server state: dismissing a toast
  // marks it read (so it won't return next refresh), but this set is what
  // makes it disappear immediately without refetching.
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setItems(await listNotifications());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Not a live subscription — just re-checks whenever this tab becomes the
  // active one again. Without this, testing across two accounts in two tabs
  // looks broken: the recipient's tab loaded before the sender's action ever
  // happened, and a background tab has no way to know anything changed.
  useEffect(() => {
    const onFocus = () => void load();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const unread = useMemo(() => items.filter((n) => !n.read_at), [items]);

  const toasts = useMemo(
    () => unread.filter((n) => !dismissed.has(n.id)).slice(0, MAX_TOASTS),
    [unread, dismissed],
  );

  /** Optimistic local update — the row is already stamped server-side. */
  const stampRead = useCallback((id: string) => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at ?? now } : n)));
  }, []);

  const markRead = useCallback(
    async (id: string) => {
      stampRead(id);
      try {
        await markNotificationRead(id);
      } catch {
        // A failed write just means it reappears next refresh, which is the
        // safe direction to fail in for something the user hasn't acted on.
      }
    },
    [stampRead],
  );

  const dismissToast = useCallback(
    (id: string) => {
      setDismissed((prev) => new Set(prev).add(id));
      void markRead(id);
    },
    [markRead],
  );

  const dismissAllToasts = useCallback(() => {
    setDismissed((prev) => {
      const next = new Set(prev);
      for (const n of toasts) next.add(n.id);
      return next;
    });
    for (const n of toasts) void markRead(n.id);
  }, [toasts, markRead]);

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    try {
      await markAllNotificationsRead();
    } catch {
      /* same reasoning as markRead */
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch {
      /* it comes back on refresh if the delete didn't land */
    }
  }, []);

  const value = useMemo<NotificationsValue>(
    () => ({
      items,
      unread,
      unreadCount: unread.length,
      loading,
      error,
      toasts,
      dismissToast,
      dismissAllToasts,
      markRead,
      markAllRead,
      remove,
      reload: load,
    }),
    [
      items,
      unread,
      loading,
      error,
      toasts,
      dismissToast,
      dismissAllToasts,
      markRead,
      markAllRead,
      remove,
      load,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsValue {
  const value = useContext(NotificationsContext);
  if (!value) {
    throw new Error("useNotifications must be used inside NotificationsProvider.");
  }
  return value;
}
