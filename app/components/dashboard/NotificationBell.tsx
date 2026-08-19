/*
  The header bell + its dropdown, and the corner toast stack.

  Both read the same provider (see lib/notificationsContext), so opening the
  panel and dismissing a toast stay in sync without either knowing about the
  other.

  Toast placement is bottom-LEFT on desktop: the "Ask Lumi" launcher already
  owns the bottom-right corner, and stacking notifications on top of it would
  bury the coach behind whatever arrived that morning.
*/

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  BadgeCheck,
  CheckCheck,
  Clock,
  ListChecks,
  Megaphone,
  MessageSquareText,
  Send,
  Trash2,
  UserCog,
  X,
  type LucideIcon,
} from "lucide-react";
import { useNotifications } from "~/lib/notificationsContext";
import type { NotificationKind, NotificationRow } from "~/lib/db";
import { relativeTime } from "./ui";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  announcement: Megaphone,
  submission: Send,
  feedback: MessageSquareText,
  task: ListChecks,
  hours: Clock,
  role: UserCog,
};

const KIND_TONE: Record<NotificationKind, string> = {
  announcement: "bg-marker/15 text-marker-dim",
  submission: "bg-pen/10 text-pen",
  feedback: "bg-pen/10 text-pen",
  task: "bg-pen/10 text-pen",
  hours: "bg-good/12 text-good",
  role: "bg-marker/15 text-marker-dim",
};

/* ───────────────────────── bell + panel ───────────────────────── */

export function NotificationBell() {
  const { items, unreadCount, loading, error, markRead, markAllRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-outside and Escape both close it — a dropdown anchored in a sticky
  // header is easy to leave open by accident while scrolling.
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        className="relative inline-flex items-center justify-center w-10 h-10 border border-rule hover:border-pen rounded-lg text-ink-soft hover:text-ink transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[1.15rem] h-[1.15rem] px-1 inline-flex items-center justify-center bg-flag text-white course-code text-[0.6rem] font-bold rounded-full border-2 border-paper">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-paper border border-rule rounded-xl shadow-[var(--shadow-hover)] overflow-hidden z-50">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-rule bg-paper-dim">
            <p className="course-code text-[0.62rem] uppercase tracking-[0.15em] text-ink-soft">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="inline-flex items-center gap-1.5 course-code text-[0.6rem] uppercase tracking-wide text-pen hover:text-pen-dim transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {loading ? (
              <p className="text-ink-soft text-sm px-4 py-8 text-center">Loading…</p>
            ) : error ? (
              <p className="text-ink-soft text-sm px-4 py-8 text-center">{error}</p>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-dim text-ink-soft mb-3">
                  <Bell className="w-4 h-4" />
                </span>
                <p className="text-ink font-semibold text-sm">You're all caught up.</p>
                <p className="text-ink-soft text-xs leading-relaxed mt-1">
                  Updates on your guides, tasks, and hours will show up here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-rule">
                {items.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onOpen={() => {
                      void markRead(item.id);
                      setOpen(false);
                    }}
                    onRead={() => void markRead(item.id)}
                    onRemove={() => void remove(item.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  item,
  onOpen,
  onRead,
  onRemove,
}: {
  item: NotificationRow;
  onOpen: () => void;
  onRead: () => void;
  onRemove: () => void;
}) {
  const Icon = KIND_ICON[item.kind] ?? BadgeCheck;
  const unread = !item.read_at;

  const body = (
    <>
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
          KIND_TONE[item.kind] ?? "bg-pen/10 text-pen"
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <span className="text-ink font-semibold text-sm leading-snug flex-1">{item.title}</span>
          {unread && (
            <span
              className="w-2 h-2 rounded-full bg-pen shrink-0 mt-1.5"
              aria-label="Unread"
            />
          )}
        </span>
        {item.body && (
          <span className="block text-ink-soft text-xs leading-relaxed mt-1">{item.body}</span>
        )}
        <span className="block course-code text-[0.58rem] uppercase text-ink-soft mt-1.5">
          {relativeTime(item.created_at)}
        </span>
      </span>
    </>
  );

  return (
    <li className={`group relative ${unread ? "bg-pen/[0.03]" : ""}`}>
      {item.link ? (
        <Link
          to={item.link}
          onClick={onOpen}
          className="flex items-start gap-3 px-4 py-3.5 hover:bg-paper-dim transition-colors"
        >
          {body}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onRead}
          className="w-full text-left flex items-start gap-3 px-4 py-3.5 hover:bg-paper-dim transition-colors"
        >
          {body}
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Delete "${item.title}"`}
        className="absolute top-2 right-2 p-1.5 rounded-md text-ink-soft opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-flag hover:bg-flag/10 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </li>
  );
}

/* ───────────────────────── toast stack ───────────────────────── */

/**
 * The "blob" that greets you on login or refresh. One card per unread
 * notification, newest first. Dismissing marks it read, so it does not come
 * back on the next page load — and because the provider lives above the
 * router outlet, dismissal also sticks while moving between tabs.
 */
export function NotificationToasts() {
  const { toasts, dismissToast, dismissAllToasts, markRead } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-40 w-[20rem] max-w-[calc(100vw-2.5rem)] space-y-2.5"
      role="status"
      aria-live="polite"
    >
      {toasts.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={dismissAllToasts}
            className="course-code text-[0.58rem] uppercase tracking-wide text-ink-soft hover:text-ink bg-paper border border-rule rounded-md px-2 py-1 transition-colors"
          >
            Dismiss all
          </button>
        </div>
      )}

      {toasts.map((item) => {
        const Icon = KIND_ICON[item.kind] ?? BadgeCheck;
        return (
          <div
            key={item.id}
            className="reveal bg-paper border border-rule rounded-xl shadow-[var(--shadow-hover)] p-4 flex items-start gap-3"
          >
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                KIND_TONE[item.kind] ?? "bg-pen/10 text-pen"
              }`}
            >
              <Icon className="w-4 h-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-ink font-semibold text-sm leading-snug">{item.title}</p>
              {item.body && (
                <p className="text-ink-soft text-xs leading-relaxed mt-1 line-clamp-3">
                  {item.body}
                </p>
              )}
              {item.link && (
                <Link
                  to={item.link}
                  onClick={() => {
                    void markRead(item.id);
                    dismissToast(item.id);
                  }}
                  className="inline-block course-code text-[0.6rem] uppercase tracking-wide text-pen hover:text-pen-dim mt-2 transition-colors"
                >
                  View →
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              aria-label={`Dismiss "${item.title}"`}
              className="p-1 -mt-1 -mr-1 rounded-md text-ink-soft hover:text-ink transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
