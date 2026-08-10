// Brand colors, pulled from app.css's --color-chalkboard / --color-pen / --color-marker
// (oklch converted to sRGB hex) so exported files match the site's own palette.
const NAVY = "0B132B";
const BLUE = "2258E5";
const BLUE_DIM = "0F41CC";
const GRAY_TEXT = "44403C";
const GRAY_LINE = "D6D3D1";
const ROW_TINT = "F2F5FD";

export type TranscriptCourseRow = {
  name: string;
  level: string;
  grade: string;
  credits: string;
  points: string;
};

export type TranscriptSemester = {
  label: string;
  gpa: string;
  rows: TranscriptCourseRow[];
};

export type TranscriptData = {
  studentName: string;
  districtName: string;
  weightedLabel: string;
  unweightedLabel: string | null;
  weighted: string;
  unweighted: string | null;
  totalCredits: string;
  generatedAt: string;
  semesters: TranscriptSemester[];
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function fileSafeName(data: TranscriptData): string {
  const base = data.studentName === "Student" ? "illuminate-transcript" : `${data.studentName}-transcript`;
  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function exportTranscriptPdf(data: TranscriptData): Promise<void> {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Header banner
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageWidth, 86, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Illuminate — GPA Transcript", margin, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor("#C9D2E8");
  doc.text("An unofficial GPA estimate generated with Illuminate's GPA calculator", margin, 62);

  // Meta block
  let y = 116;
  const metaRows: [string, string][] = [
    ["Student", data.studentName],
    ["District / scale", data.districtName],
    ["Generated", data.generatedAt],
  ];
  doc.setFontSize(10.5);
  for (const [label, value] of metaRows) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(GRAY_TEXT);
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 110, y);
    y += 18;
  }
  y += 8;

  const ensureRoom = (needed: number) => {
    if (y + needed > pageHeight - 60) {
      doc.addPage();
      y = 40;
    }
  };

  for (const semester of data.semesters) {
    ensureRoom(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(GRAY_TEXT);
    doc.text(semester.label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(BLUE_DIM);
    doc.text(`${semester.gpa} GPA`, pageWidth - margin, y, { align: "right" });
    y += 10;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Course", "Level", "Grade", "Credits", "Points"]],
      body:
        semester.rows.length > 0
          ? semester.rows.map((r) => [r.name, r.level, r.grade, r.credits, r.points])
          : [["No courses entered", "", "", "", ""]],
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9.5,
        cellPadding: 6,
        lineColor: GRAY_LINE,
        lineWidth: 0.5,
        textColor: GRAY_TEXT,
      },
      headStyles: { fillColor: BLUE, textColor: "#FFFFFF", fontStyle: "bold", halign: "left" },
      alternateRowStyles: { fillColor: ROW_TINT },
      columnStyles: {
        2: { cellWidth: 55, halign: "center" },
        3: { cellWidth: 55, halign: "center" },
        4: { cellWidth: 55, halign: "center" },
      },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 22;
  }

  // Cumulative summary panel
  ensureRoom(90);
  const panelTop = y;
  const panelHeight = data.unweighted ? 74 : 60;
  doc.setDrawColor(BLUE);
  doc.setLineWidth(1);
  doc.setFillColor(ROW_TINT);
  doc.roundedRect(margin, panelTop, pageWidth - margin * 2, panelHeight, 6, 6, "FD");

  let statX = margin + 20;
  const drawStat = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(BLUE_DIM);
    doc.text(value, statX, panelTop + 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(GRAY_TEXT);
    doc.text(label, statX, panelTop + 50);
    statX += 170;
  };

  drawStat(`Cumulative ${data.weightedLabel}`, data.weighted);
  if (data.unweighted) drawStat(`Cumulative ${data.unweightedLabel ?? "Unweighted GPA"}`, data.unweighted);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(GRAY_TEXT);
  doc.text(`Total credits: ${data.totalCredits}`, pageWidth - margin - 20, panelTop + 20, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(GRAY_TEXT);
  doc.text(
    "This is an unofficial estimate — your school's own transcript is always the official record of your GPA and class rank.",
    margin,
    pageHeight - 30,
  );
  doc.text("Illuminate · projectilluminate.org", margin, pageHeight - 18);

  doc.save(`${fileSafeName(data)}.pdf`);
}

function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function csvRow(values: string[]): string {
  return values.map(csvField).join(",");
}

export function exportTranscriptCsv(data: TranscriptData): void {
  const lines: string[] = [];

  lines.push(csvRow(["Illuminate GPA transcript"]));
  lines.push(csvRow(["Student", data.studentName]));
  lines.push(csvRow(["District / scale", data.districtName]));
  lines.push(csvRow(["Generated", data.generatedAt]));

  for (const semester of data.semesters) {
    lines.push("");
    lines.push(csvRow([semester.label]));
    lines.push(csvRow(["Course", "Level", "Grade", "Credits", "Points"]));
    for (const r of semester.rows) {
      lines.push(csvRow([r.name, r.level, r.grade, r.credits, r.points]));
    }
    lines.push(csvRow(["", "", "", "Semester GPA", semester.gpa]));
  }

  lines.push("");
  lines.push(csvRow([`Cumulative ${data.weightedLabel}`, data.weighted]));
  if (data.unweighted) lines.push(csvRow([`Cumulative ${data.unweightedLabel ?? "Unweighted GPA"}`, data.unweighted]));
  lines.push(csvRow(["Total credits", data.totalCredits]));

  const csv = lines.join("\r\n");
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${fileSafeName(data)}.csv`);
}
