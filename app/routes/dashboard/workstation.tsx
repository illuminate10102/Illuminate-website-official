/*
  Officer Category Workstation.

  The filter is not a control the Officer operates — it is their identity.
  `profiles.officer_category` decides which submissions load, and the matching
  RLS policy refuses everything else, so there is no version of this screen
  that shows another category's drafts.

  Layout is a list on the left and the selected draft on the right: the doc
  preview and the feedback box sit side by side on desktop so notes can be
  written while reading.
*/

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  ExternalLink,
  Inbox,
  RotateCcw,
  SendHorizontal,
  ShieldQuestion,
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
  TextInput,
  VoteProgress,
  formatDate,
} from "~/components/dashboard/ui";
import { RequireRole } from "~/components/dashboard/RequireRole";
import { useDashboard } from "~/lib/dashboardContext";
import { useMutation, useQuery } from "~/lib/useQuery";
import {
  displayName,
  indexProfiles,
  listProfiles,
  listSubmissionsByCategory,
  reviewSubmission,
  type SubmissionRow,
} from "~/lib/db";
import { reviewSectionLabel } from "~/lib/roles";

export default function WorkstationTab() {
  return (
    <RequireRole minimum="officer">
      <WorkstationContent />
    </RequireRole>
  );
}

/** Google Docs renders an embeddable view at /preview for link-shared docs. */
function previewUrl(docUrl: string): string | null {
  const match = docUrl.match(/^https:\/\/docs\.google\.com\/document\/d\/([\w-]+)/i);
  return match ? `https://docs.google.com/document/d/${match[1]}/preview` : null;
}

function WorkstationContent() {
  const { user } = useDashboard();
  const category = user.officerCategory;
  const categoryLabel = reviewSectionLabel(category);

  const submissions = useQuery(
    () => listSubmissionsByCategory(category ?? ""),
    [category],
    { enabled: !!category },
  );
  const profiles = useQuery(() => listProfiles(), []);
  const rows = submissions.data ?? [];
  const authors = useMemo(() => indexProfiles(profiles.data ?? []), [profiles.data]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  // Keep a selection alive across reloads; fall back to the first row.
  useEffect(() => {
    if (rows.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !rows.some((row) => row.id === selectedId)) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  if (!category) {
    return (
      <>
        <PageHeader eyebrow="Review" title="Category workstation" />
        <Panel>
          <EmptyState
            icon={ShieldQuestion}
            title="No category assigned to you yet."
            description="A Director sets your review category from the User Management tab. Until then there's nothing for this workstation to filter to."
          />
        </Panel>
      </>
    );
  }

  const waiting = rows.filter((row) => row.status === "pending_officer");
  const passedUp = rows.filter((row) => row.status === "pending_admin");

  return (
    <>
      <PageHeader
        eyebrow="Review"
        title="Category workstation"
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatTile
          label="Waiting on you"
          value={waiting.length}
          hint="Status: pending Officer review"
          icon={ClipboardCheck}
          tone={waiting.length > 0 ? "flag" : "good"}
        />
        <StatTile
          label="Passed to Directors"
          value={passedUp.length}
          hint="Cleared by you, awaiting approval"
          icon={SendHorizontal}
          tone="pen"
        />
        <StatTile
          label="Total in category"
          value={rows.length}
          hint={categoryLabel}
          icon={Inbox}
          tone="marker"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[22rem_1fr] items-start">
        <Panel title="Submissions" description={`${categoryLabel} only.`}>
          <DataBoundary loading={submissions.loading} error={submissions.error}>
            {rows.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Queue is empty."
                description={`No Associate has filed a guide under ${categoryLabel} yet.`}
              />
            ) : (
              <ul className="space-y-2">
                {rows.map((row) => (
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
                        {displayName(authors.get(row.user_id))}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <StatusPill status={row.status} />
                        <Chip>{formatDate(row.created_at)}</Chip>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </DataBoundary>
        </Panel>

        {selected ? (
          <ReviewPane
            key={selected.id}
            submission={selected}
            authorName={displayName(authors.get(selected.user_id))}
            reviewerId={user.id}
            onReviewed={submissions.reload}
          />
        ) : (
          <Panel>
            <EmptyState
              icon={ClipboardCheck}
              title="Pick a submission to review."
              description="Choose one from the list to read the draft and leave feedback."
            />
          </Panel>
        )}
      </div>
    </>
  );
}

function ReviewPane({
  submission,
  authorName,
  reviewerId,
  onReviewed,
}: {
  submission: SubmissionRow;
  authorName: string;
  reviewerId: string;
  onReviewed: () => void;
}) {
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [hours, setHours] = useState(submission.officer_suggested_hours?.toString() ?? "");
  const { busy, error, setError, run } = useMutation();
  const preview = previewUrl(submission.doc_url);
  // Once it's left pending_officer, the guard trigger won't let this Officer
  // touch it again — it's sitting with the Directors now (see workstation.tsx
  // header comment) or already decided.
  const decided = submission.status !== "pending_officer";

  async function decide(status: "pending_admin" | "changes_requested") {
    if (status === "changes_requested" && feedback.trim().length < 5) {
      setError("Say what needs changing — the Associate only sees this note.");
      return;
    }
    let hoursValue: number | null = null;
    if (status === "pending_admin") {
      hoursValue = Number(hours);
      if (!Number.isFinite(hoursValue) || hoursValue <= 0) {
        setError("Enter how many hours the Associate should receive for this guide.");
        return;
      }
    }
    const ok = await run(() =>
      reviewSubmission(submission.id, {
        status,
        feedback: feedback.trim() || null,
        reviewerId,
        ...(status === "pending_admin" ? { officerSuggestedHours: hoursValue } : {}),
      }),
    );
    if (ok) onReviewed();
  }

  return (
    <Panel
      title={submission.title}
      description={`Submitted by ${authorName} · ${formatDate(submission.created_at)}`}
      action={
        <a
          href={submission.doc_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pen hover:text-pen-dim transition-colors"
        >
          Open in Docs <ExternalLink className="w-3.5 h-3.5" />
        </a>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2 items-start">
        <div>
          <p className="course-code text-[0.62rem] uppercase tracking-wide text-ink-soft mb-2">
            Draft
          </p>
          {preview ? (
            <div className="border border-rule rounded-lg overflow-hidden bg-paper-dim">
              <iframe
                title={`Preview of ${submission.title}`}
                src={preview}
                className="w-full h-[30rem] block"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="border border-rule rounded-lg p-5 bg-paper-dim">
              <p className="text-ink-soft text-sm leading-relaxed">
                This link can't be previewed inline. Open it in a new tab to read the draft.
              </p>
            </div>
          )}
          <p className="text-ink-soft text-xs leading-relaxed mt-2">
            A blank preview usually means the doc isn't link-shared yet — ask the Associate to set
            it to "anyone with the link can comment".
          </p>

          {submission.notes && (
            <div className="mt-4 border border-rule rounded-lg p-4 bg-paper-dim">
              <p className="course-code text-[0.6rem] uppercase text-ink-soft mb-1.5">
                Note from the Associate
              </p>
              <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap">
                {submission.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill status={submission.status} />
            <Chip tone="pen">{reviewSectionLabel(submission.category)}</Chip>
          </div>

          {submission.status === "pending_admin" && (
            <VoteProgress submission={submission} />
          )}

          {error && <ErrorNote message={error} />}

          <Field
            label="Feedback"
            htmlFor="review-feedback"
            hint="The Associate sees this verbatim, whichever button you press."
          >
            <TextArea
              id="review-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={9}
              placeholder="What's working, what needs another pass, and anything a Director should know."
              className="min-h-[12rem]"
              disabled={decided}
            />
          </Field>

          {decided ? (
            <p className="text-ink-soft text-sm leading-relaxed">
              {submission.status === "pending_admin"
                ? "Sent to the Directors — it takes 3 votes to publish it and grant hours. Nothing more for you to do here."
                : "This guide is past your review. Feedback is read-only now."}
            </p>
          ) : (
            <>
              <Field
                label="Hours for the Associate"
                htmlFor="review-hours"
                hint="What the Directors vote on — this is the amount granted if 3 of them approve."
              >
                <TextInput
                  id="review-hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 4"
                  className="max-w-[10rem]"
                />
              </Field>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  icon={SendHorizontal}
                  busy={busy}
                  onClick={() => decide("pending_admin")}
                  className="flex-1 min-w-[12rem]"
                >
                  Pass to Directors
                </Button>
                <Button
                  variant="secondary"
                  icon={RotateCcw}
                  busy={busy}
                  onClick={() => decide("changes_requested")}
                  className="flex-1 min-w-[12rem]"
                >
                  Request changes
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
