import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Database | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

// Callers only reach these from client-only effects (see useGuideLike) —
// this site renders guides via SSR, and Firebase Auth's persistence layer
// touches IndexedDB, which doesn't exist on the server.
export function getFirebaseAuth(): Auth {
  if (!authInstance) authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getFirebaseDatabase(): Database {
  if (!dbInstance) dbInstance = getDatabase(getFirebaseApp());
  return dbInstance;
}
