import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { getFirebaseAuth, getFirebaseDatabase } from "../lib/firebase";

type GuideLike = {
  /** null until the live count has loaded. */
  count: number | null;
  liked: boolean;
  like: () => void;
};

/** Live like-count + like action for one guide, backed by Firebase Realtime
 *  Database. Each visitor gets a silent anonymous auth UID (no login UI);
 *  the count is just the number of children under `likedBy`, so there's no
 *  separate counter to keep in sync — writing `likedBy/{uid}` a second time
 *  just overwrites the same key, which is what makes "one like per
 *  visitor" hold even before the security rules also enforce it. */
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

  function like() {
    if (!uid) return;
    const db = getFirebaseDatabase();
    set(ref(db, `guideLikes/${category}/${field}/likedBy/${uid}`), true).catch(() => {});
  }

  return {
    count: likedBy ? Object.keys(likedBy).length : null,
    liked: !!(uid && likedBy?.[uid]),
    like,
  };
}
