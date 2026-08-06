import { Icon } from "../Icon";
import { useGuideLike } from "../../hooks/useGuideLike";

export function LikeButton({ category, field }: { category: string; field: string }) {
  const { count, liked, like } = useGuideLike(category, field);

  return (
    <button
      type="button"
      onClick={like}
      disabled={liked || count === null}
      aria-pressed={liked}
      aria-label={liked ? "You liked this guide" : "Like this guide"}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-semibold text-sm transition-colors disabled:cursor-default ${
        liked
          ? "border-rose/40 bg-rose/10 text-rose"
          : "border-rule text-ink-soft hover:text-rose hover:border-rose/40 hover:bg-rose/5"
      }`}
    >
      <Icon name="heart" className={`w-4 h-4 transition-transform ${liked ? "scale-110" : ""}`} />
      <span className="tabular-nums">{count === null ? "—" : count}</span>
    </button>
  );
}
