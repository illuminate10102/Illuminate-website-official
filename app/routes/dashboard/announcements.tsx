/*
  Announcements (Director only).

  Composing is the whole point of the screen, so the form sits on the right
  and stays put while the sent history scrolls beside it — the same layout the
  Submit and Task Assignment tabs use.

  The history below is read from the ACTIVITY LOG, not from `notifications`.
  That is deliberate: an announcement to "everyone" fans out into one
  notification row per recipient, so reading the notifications table would
  show the same message N times, and RLS scopes that table to your own rows
  anyway — a Director genuinely cannot read the copy that landed in someone
  else's bell. The activity log keeps exactly one row per send, which is the
  question this panel is actually asking.
*/

import { useState } from "react";
import { Megaphone, Send, Users } from "lucide-react";
import {
  Button,
  Chip,
  DataBoundary,
  EmptyState,
  ErrorNote,
  Field,
  PageHeader,
  Panel,
  SelectInput,
  StatTile,
  TextArea,
  TextInput,
  relativeTime,
} from "~/components/dashboard/ui";
import { RequireRole } from "~/components/dashboard/RequireRole";
import { useMutation, useQuery } from "~/lib/useQuery";
import {
  displayName,
  indexProfiles,
  listActivity,
  listProfiles,
  sendAnnouncement,
} from "~/lib/db";
import { ROLES, ROLE_LABEL, type Role } from "~/lib/roles";
import { useNotifications } from "~/lib/notificationsContext";

export default function AnnouncementsTab() {
  return (
    <RequireRole minimum="admin">
      <AnnouncementsContent />
    </RequireRole>
  );
}

function AnnouncementsContent() {
  const profiles = useQuery(() => listProfiles(), []);
  const activity = useQuery(() => listActivity(200), []);
  const people = profiles.data ?? [];

  const sentLog = (activity.data ?? []).filter((row) => row.action === "announcement_sent");
  const senders = indexProfiles(people);

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Announcements"
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatTile label="Announcements sent" value={sentLog.length} icon={Megaphone} tone="marker" />
        <StatTile label="People reachable" value={people.length} icon={Users} />
        <StatTile
          label="On the team"
          value={people.filter((p) => p.role !== "member").length}
          hint="Associates, Officers, and Directors"
          icon={Users}
          tone="pen"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem] items-start">
        <Panel
          title="Recently sent"
          description="One entry per send, newest first."
        >
          <DataBoundary loading={activity.loading} error={activity.error}>
            {sentLog.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="Nothing sent yet."
                description="Use the form beside this panel to send your first announcement."
              />
            ) : (
              <ul className="space-y-2.5">
                {sentLog.map((row) => (
                  <li key={row.id} className="border border-rule rounded-lg p-4 bg-paper-dim">
                    <p className="text-ink font-semibold text-sm leading-snug">{row.detail}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <Chip tone="marker">
                        {row.actor_id ? displayName(senders.get(row.actor_id)) : "System"}
                      </Chip>
                      <Chip>{relativeTime(row.created_at)}</Chip>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DataBoundary>
        </Panel>

        <Composer
          people={people}
          onSent={() => {
            activity.reload();
          }}
        />
      </div>
    </>
  );
}

/*
  Audience is one encoded select — "everyone" | "role:<role>" |
  "person:<uuid>" — because the three are mutually exclusive. Separate fields
  would let you express "all Officers AND also Priya", which the server-side
  fan-out has no way to honor.
*/
function Composer({
  people,
  onSent,
}: {
  people: { id: string; full_name: string | null; email: string; role: Role }[];
  onSent: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("everyone");
  const [sent, setSent] = useState<number | null>(null);
  const { busy, error, setError, run } = useMutation();
  const { reload } = useNotifications();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSent(null);
    if (title.trim().length < 4) {
      setError("Give the announcement a title people will understand at a glance.");
      return;
    }

    const [kind, value] = audience.split(":");
    const ok = await run(async () => {
      const count = await sendAnnouncement({
        title: title.trim(),
        body: body.trim() || null,
        link: null,
        userId: kind === "person" ? value : null,
        role: kind === "role" ? (value as Role) : null,
      });
      setSent(count);
      // The sender is usually inside their own audience — refresh the bell so
      // they see it immediately instead of wondering whether it worked.
      await reload();
    });
    if (!ok) return;
    setTitle("");
    setBody("");
    onSent();
  }

  return (
    <Panel title="New announcement" className="lg:sticky lg:top-24">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <ErrorNote message={error} />}
        {sent !== null && (
          <p className="flex items-start gap-2 text-sm text-ink bg-good/10 border border-good/30 rounded-lg px-3.5 py-2.5">
            <Megaphone className="w-4 h-4 shrink-0 mt-0.5 text-good" />
            <span>
              Sent to {sent} {sent === 1 ? "person" : "people"}.
            </span>
          </p>
        )}

        <Field label="Title" htmlFor="announce-title">
          <TextInput
            id="announce-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Office hours moved to Thursday"
          />
        </Field>

        <Field
          label="Message"
          htmlFor="announce-body"
          hint="Optional — the detail shown under the title."
        >
          <TextArea
            id="announce-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="min-h-[6rem]"
          />
        </Field>

        <Field
          label="Send to"
          htmlFor="announce-audience"
          hint="Everyone includes Members who aren't on the team."
        >
          <SelectInput
            id="announce-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="everyone">Everyone</option>
            <optgroup label="One tier">
              {ROLES.map((role) => (
                <option key={role} value={`role:${role}`}>
                  All {ROLE_LABEL[role]}s
                </option>
              ))}
            </optgroup>
            <optgroup label="One person">
              {people.map((person) => (
                <option key={person.id} value={`person:${person.id}`}>
                  {person.full_name?.trim() || person.email} · {ROLE_LABEL[person.role]}
                </option>
              ))}
            </optgroup>
          </SelectInput>
        </Field>

        <Button type="submit" icon={Send} busy={busy} className="w-full">
          Send announcement
        </Button>
      </form>
    </Panel>
  );
}
