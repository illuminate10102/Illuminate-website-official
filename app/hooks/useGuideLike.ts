import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { onValue, ref, remove, set } from "firebase/database";
import { getFirebaseAuth, getFirebaseDatabase } from "../lib/firebase";

type GuideLike = {
  /** null until the live count has loaded. */
  count: number | null;
  liked: boolean;
  toggleLike: () => void;
};

/** Live like-count + like/unlike toggle for one guide, backed by Firebase
 *  Realtime Database. Each visitor gets a silent anonymous auth UID (no
 *  login UI); the count is just the number of children under `likedBy`, so
 *  there's no separate counter to keep in sync either direction — liking
 *  writes `likedBy/{uid}`, unliking removes it, and the live listener below
 *  re-derives the count from whatever's left. The security rule
 *  (`auth.uid === $uid`) already covers both: Realtime Database skips
 *  `.validate` on a delete, so the same rule that allows a visitor to write
 *  their own like also allows them to remove it. */
export function useGuideLike(category: string, field: string): GuideLike {
  const [uid, setUid] = useState<string | null>(null);
  const [likedBy, setLikedBy] = useState<Record<string, true> | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUid(user.uid);
      } else {
        signInAnonymously(auth).catch(() => {
          // No uid this session — the like button just stays disabled;
          // the rest of the guide is unaffected.
        });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const db = getFirebaseDatabase();
    const likedByRef = ref(db, `guideLikes/${category}/${field}/likedBy`);
    const unsubscribe = onValue(likedByRef, (snapshot) => {
      setLikedBy(snapshot.val() ?? {});
    });
    return unsubscribe;
  }, [category, field]);

  const liked = !!(uid && likedBy?.[uid]);

  function toggleLike() {
    if (!uid) return;
    const db = getFirebaseDatabase();
    const likeRef = ref(db, `guideLikes/${category}/${field}/likedBy/${uid}`);
    if (liked) {
      remove(likeRef).catch(() => {});
    } else {
      set(likeRef, true).catch(() => {});
    }
  }

  return {
    count: likedBy ? Object.keys(likedBy).length : null,
    liked,
    toggleLike,
  };
}
