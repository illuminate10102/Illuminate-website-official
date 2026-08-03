import { useState, type FormEvent } from "react";
import { ChalkUnderline } from "../ChalkUnderline";
import { Icon } from "../Icon";
import { FEEDBACK_ENDPOINT } from "../../lib/feedback";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Per-guide feedback box, submitted to a Google Sheet via a Google Apps
 * Script Web App (see FEEDBACK_ENDPOINT in lib/feedback.ts). Apps Script
 * web apps don't send CORS headers a browser can read, so this fires the
 * POST with mode: "no-cors" and treats a non-throwing fetch as success —
 * the request still reaches the script and appends the row either way,
 * we just can't inspect the response.
 */
export function FeedbackForm({ page }: { page: string }) {
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
          type: "feedback",
          page,
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
    <div className="mt-20 pt-14 border-t border-rule">
      <h2 className="relative inline-block font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight mb-3">
        Have feedback on this page?
        <ChalkUnderline />
      </h2>
      <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-xl">
        Tell us if something's wrong, missing, or could be clearer — a real person reads these.
      </p>

      <div className="border border-rule rounded-lg bg-paper-dim p-6 sm:p-8 max-w-2xl">
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
              <label className="block text-sm font-semibold text-ink mb-1.5">Your feedback</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Something wrong, missing, or confusing on this page? Tell us."
                className={`${inputClasses} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending" || !message.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pen-solid hover:bg-pen-solid-dim disabled:opacity-50 disabled:hover:bg-pen-solid text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Icon name="mail" className="w-4 h-4" />
              {status === "sending" ? "Sending…" : "Send feedback"}
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
  );
}
