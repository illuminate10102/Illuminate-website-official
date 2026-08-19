/*
  Director approval desk.

  A guide only publishes — and its hours only grant — once 3 Directors cast
  the same vote (see tally_guide_admin_votes() in supabase/schema.sql). This
  screen is where a Director casts theirs: no single click here approves or
  rejects anything by itself, it just contributes one vote toward whichever
  outcome reaches quorum first. The database enforces this independent of
  the UI — a Director can't shortcut it by hand even via a raw API call.

  Hours are no longer granted from this screen either: the amount is fixed
  by the Officer (officer_suggested_hours) back on the submission itself,
  and the grant happens automatically, atomically, the moment the 3rd
  approve vote lands.
*/

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  RotateCcw,
  ThumbsDown,
  Users,
} from "lucide-react";
import {
  Button,
  Chip,
  DataBoundary,
  EmptyState,
  ErrorNote,
  Field,
  PageHeader,
  Panel,
  StatTile,
  StatusPill,
  TextArea,
  VoteProgress,
  formatDate,
} from "~/components/dashboard/ui";
import { RequireRole } from "~/components/dashboard/RequireRole";
import { useDashboard } from "~/lib/dashboardContext";
import { useMutation, useQuery } from "~/lib/useQuery";
import {
  castAdminVote,
  displayName,
  indexProfiles,
  indexVotesBySubmission,
  listAllAdminVotes,
  listAllHours,
  listAllSubmissions,
  listProfiles,
  updateSubmissionFeedback,
  type AdminVoteDecision,
  type AdminVoteRow,
  type ProfileRow,
  type SubmissionRow,
} from "~/lib/db";
import { reviewSectionLabel, SUBMISSION_STATUSES, type SubmissionStatus } from "~/lib/roles";

type Filter = SubmissionStatus | "all";

export default function ApprovalsTab() {
  return (
    <RequireRole minimum="admin">
      <ApprovalsContent />
    </RequireRole>
  );
}

function ApprovalsContent() {
  const { user } = useDashboard();
  const submissions = useQuery(() => listAllSubmissions(), []);
  const profiles = useQuery(() => listProfiles(), []);
  const hours = useQuery(() => listAllHours(), []);
  const votes = useQuery(() => listAllAdminVotes(), []);

  const rows = submissions.data ?? [];
  const people = useMemo(() => indexProfiles(profiles.data ?? []), [profiles.data]);
  const votesBySubmission = useMemo(
    () => indexVotesBySubmission(votes.data ?? []),
    [votes.data],
  );
  const [filter, setFilter] = useState<Filter>("pending_admin");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [rows, filter],
  );

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  useEffect(() => {
    if (visible.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !visible.some((row) => row.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

  const pendingAdmin = rows.filter((row) => row.status === "pending_admin");
  const awaitingMyVote = pendingAdmin.filter(
    (row) => !(votesBySubmission.get(row.id) ?? []).some((v) => v.admin_id === user.id),
  ).length;
  const approved = rows.filter((row) => row.status === "approved");
  const hoursGranted = (hours.data ?? []).reduce((sum, row) => sum + Number(row.hours || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Approval desk"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatTile
          label="Awaiting your vote"
          value={awaitingMyVote}
          hint="Cleared by an Officer, needs you specifically"
          icon={Inbox}
          tone={awaitingMyVote > 0 ? "flag" : "good"}
        />
        <StatTile
          label="In review"
          value={pendingAdmin.length}
          hint="Across all Directors"
          icon={Users}
          tone="pen"
        />
        <StatTile
          label="Published guides"
          value={approved.length}
          hint={`${rows.length} submissions in total`}
          icon={BadgeCheck}
          tone="good"
        />
        <StatTile
          label="Hours awarded"
          value={hoursGranted.toLocaleString()}
          hint="Across every Associate"
          icon={Clock}
          tone="marker"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[22rem_1fr] items-start">
        <Panel
          title="Queue"
          action={
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              aria-label="Filter by status"
              className="px-2.5 py-1.5 bg-paper border border-rule rounded-md text-ink text-xs focus:outline-none focus:border-pen"
            >
              <option value="pending_admin">Awaiting approval</option>
              {SUBMISSION_STATUSES.filter((status) => status !== "pending_admin").map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
              <option value="all">All</option>
            </select>
          }
        >
          <DataBoundary loading={submissions.loading} error={submissions.error}>
            {visible.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Nothing here."
                description="Try a different status filter — or enjoy the empty queue."
              />
            ) : (
              <ul className="space-y-2">
                {visible.map((row) => {
                  const iVoted = (votesBySubmission.get(row.id) ?? []).some(
                    (v) => v.admin_id === user.id,
                  );
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        aria-current={row.id === selectedId}
                        className={`w-full text-left border border-rule rounded-lg p-4 transition-colors ${
                          row.id === selectedId ? "bg-paper" : "bg-paper-dim hover:bg-paper"
                        }`}
                      >
                        <p className="text-ink font-semibold text-sm leading-snug">{row.title}</p>
                        <p className="text-ink-soft text-xs mt-1.5">
                          {displayName(people.get(row.user_id))}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <StatusPill status={row.status} />
                          <Chip tone="pen">{reviewSectionLabel(row.category)}</Chip>
                          {row.status === "pending_admin" && (
                            <Chip tone={iVoted ? "good" : "flag"}>
                              {iVoted ? "You voted" : "Needs your vote"}
                            </Chip>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </DataBoundary>
        </Panel>

        {selected ? (
          <DecisionPane
            key={selected.id}
            submission={selected}
            author={people.get(selected.user_id)}
            people={people}
            votes={votesBySubmission.get(selected.id) ?? []}
            adminId={user.id}
            onChanged={() => {
              submissions.reload();
              hours.reload();
              votes.reload();
            }}
          />
        ) : (
          <Panel>
            <EmptyState
              icon={BadgeCheck}
              title="Select a submission."
              description="Pick one from the queue to read the Officer's notes and vote."
            />
          </Panel>
        )}
      </div>
    </>
  );
}

function DecisionPane({
  submission,
  author,
  people,
  votes,
  adminId,
  onChanged,
}: {
  submission: SubmissionRow;
  author: ProfileRow | undefined;
  people: Map<string, ProfileRow>;
  votes: AdminVoteRow[];
  adminId: string;
  onChanged: () => void;
}) {
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const { busy, error, setError, run } = useMutation();
  const { busy: savingNote, run: runSaveNote } = useMutation();

  async function saveNote() {
    await runSaveNote(() => updateSubmissionFeedback(submission.id, feedback.trim() || null));
  }

  async function vote(decision: AdminVoteDecision) {
    if (decision === "reject" && feedback.trim().length < 5) {
      setError("Say why this guide is being rejected before voting — save a note first.");
      return;
    }
    const ok = await run(() => castAdminVote({ submission_id: submission.id, admin_id: adminId, decision }));
    if (ok) onChanged();
  }

  return (
    <div className="space-y-6">
      <Panel
        title={submission.title}
        description={`By ${displayName(author)} · filed ${formatDate(submission.created_at)}`}
        action={
          <a
            href={submission.doc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pen hover:text-pen-dim transition-colors"
          >
            Open the doc <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill status={submission.status} />
            <Chip tone="pen">{reviewSectionLabel(submission.category)}</Chip>
            {submission.officer_suggested_hours != null && (
              <Chip tone="good" className="text-[0.78rem] font-bold px-3 py-2">
                <Clock className="w-3.5 h-3.5" />
                Officer suggested {submission.officer_suggested_hours} hrs
              </Chip>
            )}
            {submission.reviewed_at && (
              <Chip>Reviewed {formatDate(submission.reviewed_at)}</Chip>
            )}
          </div>

          {submission.status === "pending_admin" && (
            <VoteProgress submission={submission} />
          )}

          {submission.notes && (
            <div className="border border-rule rounded-lg p-4 bg-paper-dim">
              <p className="course-code text-[0.6rem] uppercase text-ink-soft mb-1.5">
                Note from {displayName(author)}
              </p>
              <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap">
                {submission.notes}
              </p>
            </div>
          )}

          {error && <ErrorNote message={error} />}

          <Field
            label="Notes"
            htmlFor="director-notes"
            hint="Shared across every Director looking at this guide — the Associate sees this too."
          >
            <TextArea
              id="director-notes"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={7}
              placeholder="What the Officer said, and anything Directors voting after you should know."
              className="min-h-[9rem]"
              disabled={submission.status !== "pending_admin"}
            />
          </Field>
          {submission.status === "pending_admin" && (
            <Button variant="secondary" busy={savingNote} onClick={saveNote} className="w-fit">
              Save note
            </Button>
          )}

          {submission.status === "pending_admin" ? (
            <VotePanel
              submissionId={submission.id}
              adminId={adminId}
              votes={votes}
              people={people}
              busy={busy}
              onVote={vote}
            />
          ) : (
            <VoteHistory votes={votes} people={people} />
          )}
        </div>
      </Panel>
    </div>
  );
}

/**
 * The three vote buttons plus a roll call of who's voted which way so far —
 * this is the only place a Director's decision actually gets recorded, and
 * it takes 3 matching votes (from anyone, not necessarily the first 3 to
 * show up) before anything happens to the submission.
 */
function VotePanel({
  submissionId,
  adminId,
  votes,
  people,
  busy,
  onVote,
}: {
  submissionId: string;
  adminId: string;
  votes: AdminVoteRow[];
  people: Map<string, ProfileRow>;
  busy: boolean;
  onVote: (decision: AdminVoteDecision) => void;
}) {
  const myVote = votes.find((v) => v.admin_id === adminId);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        <Button
          icon={BadgeCheck}
          busy={busy}
          variant={myVote?.decision === "approve" ? "primary" : "secondary"}
          onClick={() => onVote("approve")}
        >
          {myVote?.decision === "approve" ? "You voted: Approve" : "Approve & publish"}
        </Button>
        <Button
          icon={RotateCcw}
          busy={busy}
          variant={myVote?.decision === "changes_requested" ? "primary" : "secondary"}
          onClick={() => onVote("changes_requested")}
        >
          {myVote?.decision === "changes_requested" ? "You voted: Changes" : "Send back for changes"}
        </Button>
        <Button
          icon={ThumbsDown}
          busy={busy}
          variant={myVote?.decision === "reject" ? "danger" : "secondary"}
          onClick={() => onVote("reject")}
        >
          {myVote?.decision === "reject" ? "You voted: Reject" : "Reject"}
        </Button>
      </div>
      {myVote && (
        <p className="text-ink-soft text-xs leading-relaxed">
          You can change your vote any time before quorum is reached — just pick a different option.
        </p>
      )}
      <VoteHistory votes={votes} people={people} />
    </div>
  );
}

const VOTE_LABEL: Record<AdminVoteDecision, string> = {
  approve: "Approve",
  reject: "Reject",
  changes_requested: "Changes",
};

function VoteHistory({
  votes,
  people,
}: {
  votes: AdminVoteRow[];
  people: Map<string, ProfileRow>;
}) {
  if (votes.length === 0) {
    return <p className="text-ink-soft text-sm">No Director has voted on this yet.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {votes.map((vote) => (
        <li
          key={vote.id}
          className="flex items-center gap-2 text-sm text-ink-soft"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-good" />
          <span className="text-ink font-medium">{displayName(people.get(vote.admin_id))}</span>
          voted <Chip tone={vote.decision === "reject" ? "flag" : vote.decision === "approve" ? "good" : "marker"}>
            {VOTE_LABEL[vote.decision]}
          </Chip>
        </li>
      ))}
    </ul>
  );
}
