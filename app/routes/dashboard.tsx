/*
  Dashboard layout route — the shell every tab renders inside.

  Responsibilities, in order:
    1. Wait for the client-side session to resolve (SSR renders the spinner).
    2. Bounce signed-out visitors to a sign-in prompt.
    3. Render the role-filtered sidebar, the identity header, and the tab.

  Route-level gating happens in `RequireRole` (see `dashboardGuards.tsx`),
  which each restricted tab wraps itself in. That keeps the rule next to the
  screen it protects instead of in a lookup table here.
*/

import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LogOut, Menu, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import type { Route } from "./+types/dashboard";
import { Avatar, useAuth } from "~/auth";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Sidebar } from "~/components/dashboard/Sidebar";
// Lumi (the AI coach) is left out of this push — see the mount below.
// import { AICoachChat } from "~/components/dashboard/AICoachChat";
import { NotificationBell, NotificationToasts } from "~/components/dashboard/NotificationBell";
import { Chip } from "~/components/dashboard/ui";
import { DashboardTour } from "~/components/dashboard/DashboardTour";
import { NotificationsProvider } from "~/lib/notificationsContext";
import { reviewSectionLabel, ROLE_LABEL } from "~/lib/roles";
import { readTourSeenRole, writeTourSeenRole } from "~/lib/tour";
import type { DashboardContext } from "~/lib/dashboardContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard — Illuminate" },
    {
      name: "description",
      content: "Track your academics, activities, contributions, and volunteer hours.",
    },
  ];
}

export default function DashboardLayout() {
  const { user, isReady, isAuthenticated, logout, openAuth, refreshUser } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onOverview = pathname === "/dashboard" || pathname === "/dashboard/";

  // The tour points at the Overview tab's own panels, so anyone who hasn't
  // seen it yet is sent there first. The stored value is the role it was last
  // finished at — a promotion makes it stale, replaying it once per tier.
  useEffect(() => {
    if (!isReady || !user) return;
    if (readTourSeenRole(user.id) === user.role) return;
    if (!onOverview) {
      navigate("/dashboard");
      return;
    }
    const timer = setTimeout(() => setTourOpen(true), 700);
    return () => clearTimeout(timer);
  }, [isReady, user, onOverview, navigate]);

  function closeTour() {
    setTourOpen(false);
    if (user) writeTourSeenRole(user.id, user.role);
  }

  function startTour() {
    setDrawerOpen(false);
    if (!onOverview) navigate("/dashboard");
    // The Overview panels the first steps point at need a frame to mount.
    setTimeout(() => setTourOpen(true), onOverview ? 0 : 400);
  }

  // The drawer is an overlay; scrolling the page underneath it is disorienting.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-soft">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <SignedOutGate onSignUp={() => openAuth("signup")} onLogIn={() => openAuth("login")} />;
  }

  const context: DashboardContext = { user, role: user.role, refreshUser };

  return (
    <NotificationsProvider>
    <div className="min-h-screen bg-paper-dim">
      <Sidebar
        role={user.role}
        officerCategory={user.officerCategory ? reviewSectionLabel(user.officerCategory) : null}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStartTour={startTour}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-paper border-b border-rule">
          <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 text-ink-soft hover:text-ink transition-colors rounded-lg"
              aria-label="Open dashboard menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 min-w-0 flex-1 rounded-lg" data-tour="header-identity">
              <Avatar user={user} className="w-9 h-9" />
              <div className="min-w-0">
                <p className="text-ink font-semibold text-sm truncate leading-tight">{user.name}</p>
                <p className="text-ink-soft text-xs truncate leading-tight">{user.email}</p>
              </div>
              <Chip tone={user.role === "admin" ? "marker" : "pen"} className="hidden sm:inline-flex">
                {ROLE_LABEL[user.role]}
              </Chip>
              {user.officerCategory && (
                <Chip className="hidden md:inline-flex">{reviewSectionLabel(user.officerCategory)}</Chip>
              )}
            </div>

            <span data-tour="notification-bell" className="inline-flex rounded-lg">
              <NotificationBell />
            </span>
            <ThemeToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 border border-rule hover:border-pen rounded-lg text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-7 lg:py-9 max-w-[1400px] mx-auto">
          <Outlet context={context} />
        </main>
      </div>

      {/* Lumi temporarily removed from this build — AICoachChat.tsx, coach.ts,
          and supabase/ai-coach.sql are untouched, just not wired in here.
          Re-add the import above and this mount to bring it back. */}
      {/* <AICoachChat /> */}
      {/* Same reasoning, plus: toast dismissal has to survive tab changes. */}
      <NotificationToasts />
      {tourOpen && (
        <DashboardTour role={user.role} onClose={closeTour} setDrawerOpen={setDrawerOpen} />
      )}
    </div>
    </NotificationsProvider>
  );
}

function SignedOutGate({ onSignUp, onLogIn }: { onSignUp: () => void; onLogIn: () => void }) {
  return (
    <section className="min-h-screen bg-paper flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center reveal">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pen/10 text-pen mb-5">
          <AlertCircle className="w-6 h-6" />
        </span>
        <h1 className="font-display font-extrabold text-3xl text-ink tracking-tight mb-3">
          Your dashboard needs an account.
        </h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Log in to track your courses, activities, and goals — and, if you volunteer with
          Illuminate, your tasks, submissions, and hours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex items-center gap-2 px-5 py-3 bg-pen-solid hover:bg-pen-solid-dim text-white font-semibold text-sm rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Create free account
          </button>
          <button
            type="button"
            onClick={onLogIn}
            className="px-5 py-3 border border-rule hover:border-pen text-ink font-semibold text-sm rounded-lg transition-colors"
          >
            Log in
          </button>
        </div>
        <Link
          to="/"
          className="inline-block mt-8 text-xs text-ink-soft hover:text-pen transition-colors"
        >
          ← Back to the site
        </Link>
      </div>
    </section>
  );
}
