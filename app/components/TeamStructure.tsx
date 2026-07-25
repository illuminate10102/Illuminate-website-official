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
    <div className="flex flex-col gap-5">
      {teamRoles.map((role, i) => (
        <div
          key={role.slug}
          className="card-elevate border border-rule rounded-lg overflow-hidden bg-paper flex flex-col md:flex-row"
        >
          <div
            className={`p-6 md:w-64 md:shrink-0 flex flex-col justify-center ${headerStyles[role.slug]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <RoleIcon slug={role.slug} className="w-5 h-5" />
              <span className="course-code text-xs opacity-50">0{i + 1}</span>
            </div>
            <h3 className="font-subtitle font-bold text-2xl">{role.title}</h3>
            {role.subtitle && (
              <p className={`text-sm mt-1 ${subtitleStyles[role.slug]}`}>{role.subtitle}</p>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-rule">
            <ul className="space-y-3">
              {role.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-ink text-sm leading-relaxed">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-marker shrink-0 mt-1.5"
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
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pen hover:text-pen-dim transition-colors"
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
