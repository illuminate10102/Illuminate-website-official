import { teamRoles } from "../data/team";
import { RoleIcon } from "./RoleIcon";

const headerStyles: Record<string, string> = {
  directors: "bg-pen-solid text-white",
  "vice-presidents": "bg-chalkboard text-chalk",
  officers: "bg-marker text-ink-solid",
  associates: "bg-paper-dim text-ink border-b border-rule",
  members: "bg-paper text-ink border-b border-rule",
};

const subtitleStyles: Record<string, string> = {
  directors: "text-white/70",
  "vice-presidents": "text-chalk-soft",
  officers: "text-ink-solid/60",
  associates: "text-ink-soft",
  members: "text-ink-soft",
};

type TeamStructureProps = {
  variant?: "info" | "apply";
};

const APPLICATION_FORM_URL = "https://forms.gle/Q3igdRzBYtkmkYc86";

// Directors and Members don't have an apply link — directors aren't
// recruited this way, and membership itself doesn't require an application.
const applyHref: Record<string, string> = {
  officers: APPLICATION_FORM_URL,
  associates: APPLICATION_FORM_URL,
};

export function TeamStructure({ variant = "info" }: TeamStructureProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {teamRoles.map((role, i) => (
        <div
          key={role.slug}
          className="card-elevate border border-rule rounded-lg overflow-hidden bg-paper flex flex-col"
        >
          <div className={`px-5 py-5 ${headerStyles[role.slug]}`}>
            <div className="flex items-center justify-between mb-2">
              <RoleIcon slug={role.slug} className="w-5 h-5" />
              <span className="course-code text-xs opacity-50">0{i + 1}</span>
            </div>
            <h3 className="font-subtitle font-bold text-2xl">{role.title}</h3>
            <p className={`text-xs mt-0.5 ${subtitleStyles[role.slug]}`}>{role.subtitle}</p>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <ul className="space-y-1.5 mb-4">
              {role.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2 text-ink text-xs leading-relaxed">
                  <span
                    className="w-1 h-1 rounded-full bg-marker shrink-0 mt-1.5"
                    aria-hidden="true"
                  />
                  {r}
                </li>
              ))}
            </ul>

            {variant === "apply" && applyHref[role.slug] && (
              <a
                href={applyHref[role.slug]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-pen hover:text-pen-dim transition-colors"
              >
                Apply as a {role.singular} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
