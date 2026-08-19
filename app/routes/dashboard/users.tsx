/*
  User role management (Director only).

  Promotion is a two-field decision — role, and for Officers the category
  they'll review — so both live in the same row and commit together. The
  category select only appears for Officers because it means nothing for any
  other tier, and `setUserRole` clears it on the way out.

  A Director cannot demote themselves here. Locking yourself out of the only
  tab that could undo it is a one-way door, and the RLS policy allows it, so
  the guard belongs in the UI.

  Removing somebody, or dropping them a tier against their will, is the one
  thing on this page a single Director cannot do alone: it takes a motion and
  three votes, the same quorum that publishes a guide. See the Motions panel
  below and supabase/member-removal.sql.
*/

import { useMemo, useState } from "react";
import {
  Check,
  Gavel,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import {
  Button,
  Chip,
  DataBoundary,
  EmptyState,
  ErrorNote,
  PageHeader,
  Panel,
  ReviewSectionSelect,
  SelectInput,
  StatTile,
  TableWrap,
  Td,
  Th,
  TextArea,
  TextInput,
  formatDate,
  relativeTime,
} from "~/components/dashboard/ui";
import { RequireRole } from "~/components/dashboard/RequireRole";
import { useDashboard } from "~/lib/dashboardContext";
import { useMutation, useQuery } from "~/lib/useQuery";
import {
  cancelRemovalMotion,
  castRemovalVote,
  displayName,
  listProfiles,
  listRemovalMotions,
  listRemovalVotes,
  openRemovalMotion,
  setUserRole,
  REMOVAL_ACTION_LABEL,
  type ProfileRow,
  type RemovalAction,
  type RemovalMotionRow,
  type RemovalVoteRow,
} from "~/lib/db";
import { REVIEW_SECTIONS, reviewSectionLabel, ROLES, ROLE_LABEL, type Role } from "~/lib/roles";

const QUORUM = 3;

export default function UsersTab() {
  return (
    <RequireRole minimum="admin">
      <UsersContent />
    </RequireRole>
  );
}

function UsersContent() {
  const { user, refreshUser } = useDashboard();
  const profiles = useQuery(() => listProfiles(), []);
  const rows = profiles.data ?? [];
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (roleFilter !== "all" && row.role !== roleFilter) return false;
      if (!needle) return true;
      return (
        row.email.toLowerCase().includes(needle) ||
        (row.full_name ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rows, query, roleFilter]);

  const counts = useMemo(() => {
    const tally: Record<Role, number> = { member: 0, associate: 0, officer: 0, admin: 0 };
    for (const row of rows) tally[row.role] = (tally[row.role] ?? 0) + 1;
    return tally;
  }, [rows]);

  const uncoveredSections = REVIEW_SECTIONS.filter(
    (section) => !rows.some((row) => row.role === "officer" && row.officer_category === section.key),
  );

  const motions = useQuery(() => listRemovalMotions(), []);
  const votes = useQuery(() => listRemovalVotes(), []);
  const openMotions = (motions.data ?? []).filter((m) => m.status === "open");

  async function reloadMotions() {
    motions.reload();
    votes.reload();
    profiles.reload();
  }

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="User management"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatTile label="Members" value={counts.member} icon={Users} />
        <StatTile label="Associates" value={counts.associate} icon={UserCog} tone="pen" />
        <StatTile
          label="Officers"
          value={counts.officer}
          hint={
            uncoveredSections.length > 0
              ? `${uncoveredSections.length} sections uncovered`
              : "Every section covered"
          }
          icon={ShieldCheck}
          tone={uncoveredSections.length > 0 ? "marker" : "good"}
        />
        <StatTile label="Directors" value={counts.admin} icon={ShieldCheck} tone="marker" />
      </div>

      {uncoveredSections.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 bg-marker/10 border border-marker/40 rounded-xl px-4 py-3">
          <span className="course-code text-[0.62rem] uppercase tracking-wide text-marker-dim">
            No Officer assigned
          </span>
          {uncoveredSections.map((section) => (
            <Chip key={section.key} tone="marker">
              {section.categoryLabel} — {section.tierLabel}
            </Chip>
          ))}
        </div>
      )}

      {openMotions.length > 0 && (
        <div className="mb-6">
          <Panel
            title="Open motions"
            description={`Each one needs ${QUORUM} Director votes before anything happens.`}
          >
            <DataBoundary loading={motions.loading} error={motions.error}>
              <ul className="space-y-3">
                {openMotions.map((motion) => (
                  <MotionCard
                    key={motion.id}
                    motion={motion}
                    target={rows.find((r) => r.id === motion.target_id) ?? null}
                    opener={rows.find((r) => r.id === motion.opened_by) ?? null}
                    adminId={user.id}
                    myVote={
                      (votes.data ?? []).find(
                        (v) => v.motion_id === motion.id && v.admin_id === user.id,
                      ) ?? null
                    }
                    isMine={motion.opened_by === user.id}
                    onChanged={reloadMotions}
                  />
                ))}
              </ul>
            </DataBoundary>
          </Panel>
        </div>
      )}

      <Panel
        title="Everyone"
        description={`${visible.length} of ${rows.length} shown.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email"
                aria-label="Search users"
                className="pl-9 w-56"
              />
            </div>
            <SelectInput
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
              aria-label="Filter by role"
              className="w-40"
            >
              <option value="all">All roles</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </SelectInput>
          </div>
        }
      >
        <DataBoundary loading={profiles.loading} error={profiles.error}>
          {visible.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nobody matches that."
              description="Clear the search or role filter to see everyone again."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Person</Th>
                  <Th>Current</Th>
                  <Th>Change role</Th>
                  <Th>Motion</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <UserRow
                    key={row.id}
                    row={row}
                    isSelf={row.id === user.id}
                    openerId={user.id}
                    motion={openMotions.find((m) => m.target_id === row.id) ?? null}
                    onMotionFiled={reloadMotions}
                    onSaved={async () => {
                      profiles.reload();
                      if (row.id === user.id) await refreshUser();
                    }}
                  />
                ))}
              </tbody>
            </TableWrap>
          )}
        </DataBoundary>
      </Panel>
    </>
  );
}

function UserRow({
  row,
  isSelf,
  openerId,
  motion,
  onMotionFiled,
  onSaved,
}: {
  row: ProfileRow;
  isSelf: boolean;
  openerId: string;
  motion: RemovalMotionRow | null;
  onMotionFiled: () => void | Promise<void>;
  onSaved: () => void | Promise<void>;
}) {
  const [role, setRole] = useState<Role>(row.role);
  const [category, setCategory] = useState<string>(
    row.officer_category ?? REVIEW_SECTIONS[0].key,
  );
  const [saved, setSaved] = useState(false);
  const [filing, setFiling] = useState(false);
  const { busy, error, setError, run } = useMutation();

  const dirty = role !== row.role || (role === "officer" && category !== row.officer_category);
  // A Director demoting themselves loses the only tab that could reverse it.
  const selfDemotion = isSelf && role !== "admin";

  async function save() {
    if (selfDemotion) {
      setError("Ask another Director to change your own role.");
      return;
    }
    const ok = await run(() => setUserRole(row.id, role, role === "officer" ? category : null));
    if (!ok) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    await onSaved();
  }

  return (
    <>
    <tr>
      <Td>
        <p className="text-ink font-medium">
          {displayName(row)}
          {isSelf && <span className="text-ink-soft font-normal"> (you)</span>}
        </p>
        <p className="text-ink-soft text-xs truncate max-w-[16rem]">{row.email}</p>
      </Td>
      <Td>
        <div className="flex flex-wrap gap-1.5">
          <Chip tone={row.role === "admin" ? "marker" : row.role === "member" ? "neutral" : "pen"}>
            {ROLE_LABEL[row.role]}
          </Chip>
          {row.officer_category && <Chip>{reviewSectionLabel(row.officer_category)}</Chip>}
        </div>
      </Td>
      <Td>
        <div className="flex flex-wrap items-center gap-2">
          <SelectInput
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            aria-label={`Role for ${displayName(row)}`}
            className="w-36"
          >
            {ROLES.map((option) => (
              <option key={option} value={option}>
                {ROLE_LABEL[option]}
              </option>
            ))}
          </SelectInput>

          {role === "officer" && (
            <ReviewSectionSelect
              value={category}
              onChange={setCategory}
              ariaLabel={`Review section for ${displayName(row)}`}
              className="w-56"
            />
          )}

          <Button
            onClick={save}
            busy={busy}
            disabled={!dirty || selfDemotion}
            variant={dirty ? "primary" : "secondary"}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Saved
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-2 max-w-md">
            <ErrorNote message={error} />
          </div>
        )}
      </Td>
      <Td>
        {motion ? (
          <Chip tone="flag">
            {motion.approve_votes}/{QUORUM} votes
          </Chip>
        ) : isSelf ? (
          <span className="text-ink-soft text-xs">—</span>
        ) : (
          <Button
            variant="danger"
            icon={Gavel}
            onClick={() => setFiling((v) => !v)}
            aria-expanded={filing}
          >
            {filing ? "Close" : "Open motion"}
          </Button>
        )}
      </Td>
      <Td className="text-ink-soft whitespace-nowrap">{formatDate(row.created_at)}</Td>
    </tr>

    {filing && !motion && (
      <tr>
        <Td className="bg-paper-dim" colSpan={5}>
          <MotionForm
            target={row}
            openerId={openerId}
            onCancel={() => setFiling(false)}
            onFiled={async () => {
              setFiling(false);
              await onMotionFiled();
            }}
          />
        </Td>
      </tr>
    )}
    </>
  );
}

/*
  Filing a motion. Deliberately more friction than the role dropdown beside
  it: you pick the action, you write down why, and even then nothing happens
  until two other Directors agree with you.
*/
function MotionForm({
  target,
  openerId,
  onCancel,
  onFiled,
}: {
  target: ProfileRow;
  openerId: string;
  onCancel: () => void;
  onFiled: () => void | Promise<void>;
}) {
  const [action, setAction] = useState<RemovalAction>("demote_member");
  const [reason, setReason] = useState("");
  const { busy, error, setError, run } = useMutation();

  async function file() {
    if (reason.trim().length < 8) {
      setError("Write a sentence on why. Everyone voting will read it.");
      return;
    }
    const ok = await run(() =>
      openRemovalMotion({
        target_id: target.id,
        opened_by: openerId,
        action,
        reason: reason.trim(),
      }),
    );
    if (ok) await onFiled();
  }

  return (
    <div className="max-w-2xl space-y-3 py-1">
      <p className="text-ink text-sm font-semibold">
        Open a motion against {displayName(target)}
      </p>

      <div className="flex flex-wrap items-start gap-2">
        <SelectInput
          value={action}
          onChange={(e) => setAction(e.target.value as RemovalAction)}
          aria-label="What the motion does"
          className="w-60"
        >
          <option value="demote_member">{REMOVAL_ACTION_LABEL.demote_member}</option>
          <option value="demote_officer">{REMOVAL_ACTION_LABEL.demote_officer}</option>
          <option value="delete">{REMOVAL_ACTION_LABEL.delete}</option>
        </SelectInput>
        <TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this needed?"
          aria-label="Reason"
          className="flex-1 min-w-[16rem] min-h-[3.5rem]"
        />
      </div>

      {action === "delete" && (
        <p className="text-flag text-xs leading-relaxed">
          This one erases the account and everything they wrote. It can't be undone once
          three Directors have voted.
        </p>
      )}

      {error && <ErrorNote message={error} />}

      <div className="flex items-center gap-2">
        <Button variant="danger" icon={Gavel} onClick={file} busy={busy}>
          File it
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Never mind
        </Button>
      </div>
      <p className="text-ink-soft text-xs">
        Your own vote counts as the first of {QUORUM}. You can withdraw the motion any time
        before it passes.
      </p>
    </div>
  );
}

/*
  One open motion. Every Director sees the same card; the buttons differ by
  what you've already done — voted or not, opened it or not.
*/
function MotionCard({
  motion,
  target,
  opener,
  adminId,
  myVote,
  isMine,
  onChanged,
}: {
  motion: RemovalMotionRow;
  target: ProfileRow | null;
  opener: ProfileRow | null;
  adminId: string;
  myVote: RemovalVoteRow | null;
  isMine: boolean;
  onChanged: () => void | Promise<void>;
}) {
  const { busy, error, run } = useMutation();
  const voted = myVote?.approve === true;

  async function vote(approve: boolean) {
    const ok = await run(() =>
      castRemovalVote({ motion_id: motion.id, admin_id: adminId, approve }),
    );
    if (ok) await onChanged();
  }

  async function withdraw() {
    const ok = await run(() => cancelRemovalMotion(motion.id));
    if (ok) await onChanged();
  }

  return (
    <li className="border border-flag/30 bg-flag/[0.06] rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink font-semibold text-sm">
            {REMOVAL_ACTION_LABEL[motion.action]} — {target ? displayName(target) : "a former user"}
          </p>
          <p className="text-ink-soft text-sm leading-relaxed mt-1">{motion.reason}</p>
          <p className="course-code text-[0.6rem] uppercase text-ink-soft mt-2">
            Opened by {opener ? displayName(opener) : "a Director"} · {relativeTime(motion.created_at)}
          </p>
        </div>
        <Chip tone={motion.approve_votes >= QUORUM - 1 ? "flag" : "marker"}>
          {motion.approve_votes}/{QUORUM} votes
        </Chip>
      </div>

      {error && (
        <div className="mt-3">
          <ErrorNote message={error} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {voted ? (
          <Button variant="secondary" icon={X} onClick={() => vote(false)} busy={busy}>
            Take my vote back
          </Button>
        ) : (
          <Button variant="danger" icon={Check} onClick={() => vote(true)} busy={busy}>
            Vote yes
          </Button>
        )}
        {isMine && (
          <Button variant="ghost" icon={Trash2} onClick={withdraw} busy={busy}>
            Withdraw the motion
          </Button>
        )}
      </div>
    </li>
  );
}
