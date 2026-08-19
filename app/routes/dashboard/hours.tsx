/*
  Volunteer hours tracker (Associate+).

  Hours are read-only here by design: only a Director can grant them, and
  they're always tied to a reason (usually an approved guide). The "pending"
  number is derived from submissions still in review rather than stored, so
  it can't drift out of sync with the approval queue.
*/

import { useMemo, useState } from "react";
import { Award, Clock, Download, FileClock, Hourglass } from "lucide-react";
import {
  Button,
  Chip,
  DataBoundary,
  EmptyState,
  PageHeader,
  Panel,
  StatTile,
  StatusPill,
  TableWrap,
  Td,
  Th,
  VoteProgress,
  formatDate,
} from "~/components/dashboard/ui";
import { RequireRole } from "~/components/dashboard/RequireRole";
import { downloadHoursCertificate } from "~/components/dashboard/certificate";
import { useDashboard } from "~/lib/dashboardContext";
import { useQuery } from "~/lib/useQuery";
import { listMyHours, listMySubmissions, totalHours } from "~/lib/db";
import { reviewSectionLabel } from "~/lib/roles";

export default function HoursTab() {
  return (
    <RequireRole minimum="associate">
      <HoursContent />
    </RequireRole>
  );
}

function HoursContent() {
  const { user } = useDashboard();
  const hours = useQuery(() => listMyHours(user.id), [user.id]);
  const submissions = useQuery(() => listMySubmissions(user.id), [user.id]);

  const rows = hours.data ?? [];
  const total = totalHours(rows);

  // null = "everything" (the default, and what a plain "select all" resets
  // to) — tracked separately from a full Set so a fresh grant that lands
  // after the page loads is included automatically instead of silently
  // left out of an already-materialized selection.
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const isSelected = (id: string) => selectedIds === null || selectedIds.has(id);
  const selectedRows = rows.filter((row) => isSelected(row.id));
  const selectedTotal = totalHours(selectedRows);
  const allSelected = selectedIds === null || rows.every((row) => selectedIds.has(row.id));

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev ?? rows.map((row) => row.id));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : null);
  }

  const pending = useMemo(
    () =>
      (submissions.data ?? []).filter(
        (row) => row.status === "pending_officer" || row.status === "pending_admin",
      ),
    [submissions.data],
  );

  const thisYear = rows
    .filter((row) => row.date.startsWith(String(new Date().getFullYear())))
    .reduce((sum, row) => sum + Number(row.hours || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Contribute"
        title="Volunteer hours"
        action={
          <Button
            icon={Download}
            variant="secondary"
            disabled={selectedRows.length === 0}
            onClick={() =>
              downloadHoursCertificate({
                studentName: user.name,
                studentEmail: user.email,
                rows: selectedRows,
                total: selectedTotal,
              })
            }
          >
            {allSelected
              ? "Download certificate"
              : `Download certificate (${selectedRows.length} of ${rows.length})`}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatTile
          label="Total hours"
          value={total.toLocaleString()}
          hint="All time, Director-awarded"
          icon={Clock}
          tone="good"
        />
        <StatTile
          label={`Hours in ${new Date().getFullYear()}`}
          value={thisYear.toLocaleString()}
          icon={Award}
          tone="marker"
        />
        <StatTile
          label="Awaiting a decision"
          value={pending.length}
          hint="Submissions in review — hours follow approval"
          icon={Hourglass}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Panel
          title="Awarded hours"
          description={
            allSelected
              ? "Each row was signed off by a Director. All selected for the certificate."
              : `${selectedRows.length} of ${rows.length} selected for the certificate.`
          }
        >
          <DataBoundary loading={hours.loading} error={hours.error}>
            {rows.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No hours awarded yet."
                description="Submit a guide, get it through Officer review and Director approval, and hours land here."
              />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th className="w-8">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all rows for the certificate"
                        className="w-4 h-4 accent-pen-solid align-middle"
                      />
                    </Th>
                    <Th>Date</Th>
                    <Th>Reason</Th>
                    <Th className="text-right">Hours</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <Td>
                        <input
                          type="checkbox"
                          checked={isSelected(row.id)}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Include ${row.reason} in the certificate`}
                          className="w-4 h-4 accent-pen-solid align-middle"
                        />
                      </Td>
                      <Td className="text-ink-soft whitespace-nowrap">{formatDate(row.date)}</Td>
                      <Td className="text-ink">{row.reason}</Td>
                      <Td className="text-right tabular-nums text-ink font-semibold">
                        {Number(row.hours).toFixed(1)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            )}
          </DataBoundary>
        </Panel>

        <Panel
          title="Pending review"
          description="Nothing to do here — it's a view of where each draft sits."
        >
          <DataBoundary loading={submissions.loading} error={submissions.error}>
            {pending.length === 0 ? (
              <EmptyState
                icon={FileClock}
                title="Nothing in review."
                description="Every guide you've submitted has been decided on."
              />
            ) : (
              <ul className="space-y-2.5">
                {pending.map((row) => (
                  <li key={row.id} className="border border-rule rounded-lg p-4 bg-paper-dim">
                    <p className="text-ink font-semibold text-sm leading-snug">{row.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <StatusPill status={row.status} />
                      <Chip tone="pen">{reviewSectionLabel(row.category)}</Chip>
                      {row.status === "pending_admin" && row.officer_suggested_hours != null && (
                        <Chip tone="good" className="text-[0.78rem] font-bold px-3 py-2">
                          <Clock className="w-3.5 h-3.5" />
                          {row.officer_suggested_hours} hrs suggested
                        </Chip>
                      )}
                      <Chip>Sent {formatDate(row.created_at)}</Chip>
                    </div>
                    {row.status === "pending_admin" && (
                      <div className="mt-2.5">
                        <VoteProgress submission={row} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DataBoundary>
        </Panel>
      </div>
    </>
  );
}
