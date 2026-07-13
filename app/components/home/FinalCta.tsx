import { Link } from "react-router";

export default function FinalCta() {
  return (
    <section className="bg-chalkboard py-28 sm:py-36">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-marker mb-5">
            Ready when you are
          </p>
          <h2 className="font-display font-extrabold text-5xl sm:text-6xl text-chalk tracking-tight mb-8">
            Your narrative starts on the next page.
          </h2>
          
          <div className="flex flex-wrap items-center gap-8">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-8 py-4 bg-marker hover:bg-marker-dim text-ink-solid font-bold text-lg rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Explore all resources <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/get-involved"
              className="inline-flex items-center gap-2 text-chalk font-semibold text-lg border-b-2 border-chalk-soft/40 hover:border-marker hover:text-marker transition-colors"
            >
              Join our team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
