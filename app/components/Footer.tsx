import { Link } from "react-router";
import { Icon, type IconName } from "./Icon";

const columns: Record<string, { label: string; href: string }[]> = {
  Learn: [
    { label: "Extracurriculars", href: "/extracurriculars" },
    { label: "Academics", href: "/academics" },
    { label: "Standardized testing", href: "/testing" },
    { label: "Lifestyle", href: "/lifestyle" },
    { label: "College prep", href: "/college" },
    { label: "Summer planning", href: "/summer" },
  ],
  Organization: [
    { label: "About us", href: "/about" },
    { label: "Our team", href: "/about#team" },
    { label: "Get involved", href: "/get-involved" },
    { label: "Contact", href: "/about#contact" },
  ],
};

const social: { label: string; href: string; icon: IconName }[] = [
  { label: "Instagram", href: "https://www.instagram.com/project_illuminate101/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCU3r-ZvAxnBDVQbeZOkNvug", icon: "youtube" },
  { label: "Email", href: "mailto:illuminate10102@gmail.com", icon: "mail" },
];

export default function Footer() {
  return (
    <footer className="bg-chalkboard text-chalk">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/illuminate-logo.png" alt="" className="w-8 h-8 rounded-md" />
              <span className="font-display font-extrabold text-2xl text-chalk">Illuminate</span>
            </Link>
            <p className="text-chalk-soft text-sm leading-relaxed mt-4 max-w-xs">
              A student-led nonprofit bridging the knowledge gap so every K–12
              student can build their future.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-6">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  {...(!s.href.startsWith("mailto:") && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="inline-flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full border border-rule-dark text-chalk-soft hover:text-chalk hover:border-pen/60 transition-colors"
                >
                  <Icon name={s.icon} className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-semibold">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(columns).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-marker mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-chalk-soft hover:text-chalk transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-rule-dark flex flex-col sm:flex-row items-center gap-3 font-mono text-xs text-chalk-soft/70">
          <p>© {new Date().getFullYear()} Illuminate. Student-led. Nonprofit.</p>
        </div>
      </div>
    </footer>
  );
}
