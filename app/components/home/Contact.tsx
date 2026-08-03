import { Icon, type IconName } from "../Icon";

const socialLinks: { label: string; href: string; icon: IconName }[] = [
  { label: "Instagram", href: "https://www.instagram.com/project_illuminate101/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCU3r-ZvAxnBDVQbeZOkNvug", icon: "youtube" },
  { label: "TikTok", href: "https://www.tiktok.com/@project.illuminat0", icon: "tiktok" },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-paper-dim py-24 sm:py-32 border-t border-rule scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-center">
          <div className="reveal min-w-0 max-w-xl">
            <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-6">
              Social Media
            </h2>
            <p className="text-ink-soft text-xl leading-relaxed mb-10">
              Follow us on our social media!
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {/* <a
                href="mailto:illuminate10102@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-marker hover:bg-marker-dim text-ink-solid font-bold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.03] transition-all"
              >
                <Icon name="mail" className="w-5 h-5" />
                illuminate10102@gmail.com
              </a> */}
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-rule text-ink font-bold rounded-lg hover:border-pen hover:text-pen hover:-translate-y-1 hover:scale-[1.03] transition-all"
                >
                  <Icon name={s.icon} className="w-5 h-5" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Decorative "scattered stickers" collage — hidden below lg so it
              never has to fight for space on narrow screens. Each badge is
              also a real link to that channel, echoing the buttons on the
              left rather than being pure decoration. */}
          <div className="reveal hidden lg:block relative h-[380px]">
            {/* Card matches the photo's natural 4:3 ratio exactly, so
                object-cover never has to crop it — every face stays visible
                instead of the sides getting cut off by a taller frame. */}
            <div className="absolute top-16 left-8 w-64 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-paper shadow-xl -rotate-6">
              <img
                src="/about-group-photo.jpg"
                alt="The Illuminate team"
                className="w-full h-full object-cover"
              />
            </div>
            <a
              href="mailto:illuminate10102@gmail.com"
              aria-label="Email us"
              title="Email"
              className="absolute top-0 right-4 w-16 h-16 rounded-full bg-amber/15 text-amber border border-amber/25 shadow-sm flex items-center justify-center rotate-6 hover:scale-110 hover:rotate-0 transition-transform"
            >
              <Icon name="mail" className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/project_illuminate101/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Illuminate on Instagram"
              title="Instagram"
              className="absolute bottom-4 right-0 w-14 h-14 rounded-full bg-violet/15 text-violet border border-violet/25 shadow-sm flex items-center justify-center -rotate-12 hover:scale-110 hover:rotate-0 transition-transform"
            >
              <Icon name="instagram" className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCU3r-ZvAxnBDVQbeZOkNvug"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Illuminate on YouTube"
              title="YouTube"
              className="absolute bottom-0 left-4 w-16 h-16 rounded-full bg-mint/15 text-mint border border-mint/25 shadow-sm flex items-center justify-center rotate-3 hover:scale-110 hover:rotate-0 transition-transform"
            >
              <Icon name="youtube" className="w-6 h-6" />
            </a>
            <a
              href="https://www.tiktok.com/@project.illuminat0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Illuminate on TikTok"
              title="TikTok"
              className="absolute top-4 left-0 w-14 h-14 rounded-full bg-rose/15 text-rose border border-rose/25 shadow-sm flex items-center justify-center -rotate-6 hover:scale-110 hover:rotate-0 transition-transform"
            >
              <Icon name="tiktok" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
