import { useState, type FormEvent } from "react";
import { ChalkUnderline } from "../ChalkUnderline";
import { Icon } from "../Icon";
import { FEEDBACK_ENDPOINT } from "../../lib/feedback";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Homepage feature-request box — same Google Sheet + Apps Script Web App
 * as the per-guide FeedbackForm (see lib/feedback.ts), routed to a
 * separate "Feature Requests" tab via the type field. See FeedbackForm.tsx
 * for why this uses mode: "no-cors" and treats a non-throwing fetch as
 * success.
 */
export default function FeatureRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim() || !FEEDBACK_ENDPOINT) return;

    setStatus("sending");
    try {
      await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          type: "feature-request",
          page: "Homepage — Feature request",
          url: typeof window !== "undefined" ? window.location.href : "",
          name,
          email,
          message,
        }),
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "w-full border border-rule rounded-md bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft outline-none focus:border-pen transition-colors";

  return (
    <section className="bg-paper py-24 sm:py-32 border-t border-rule">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-start">
          <div className="reveal max-w-xl">
            <h2 className="relative inline-block font-display font-extrabold text-5xl sm:text-6xl text-ink tracking-tight mb-6">
              Got an idea for the site?
              <ChalkUnderline />
            </h2>
            <p className="text-ink-soft text-xl leading-relaxed">
              A missing guide, a tool you wish existed, something that'd make this easier to
              use — tell us. Illuminate gets built around what students actually ask for.
            </p>
          </div>

          <div className="reveal border border-rule rounded-lg bg-paper-dim p-6 sm:p-8">
            {status === "sent" ? (
              <p className="text-ink text-base leading-relaxed">
                Thanks — that's been sent. We read every one of these.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">
                      Name <span className="text-ink-soft font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">
                      Email <span className="text-ink-soft font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For a reply, if you want one"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">
                    Your idea
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What feature or guide would help you most?"
                    className={`${inputClasses} resize-y`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending" || !message.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pen-solid hover:bg-pen-solid-dim disabled:opacity-50 disabled:hover:bg-pen-solid text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Icon name="lightbulb" className="w-4 h-4" />
                  {status === "sending" ? "Sending…" : "Send idea"}
                </button>

                {status === "error" && (
                  <p className="text-rose text-sm">
                    Something went wrong sending that — mind trying again?
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
