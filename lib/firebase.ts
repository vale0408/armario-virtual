// lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

// DEBUG (temporal): mira consola del navegador/terminal
console.log("[firebase] apiKey loaded?", !!firebaseConfig.apiKey);

if (!firebaseConfig.apiKey) {
  throw new Error(
    "[firebase] No se cargaron las envs. Asegúrate de tener .env.local en la raíz y reinicia el dev server."
  );
}

// Evita inicializar Firebase más de una vez (Hot Reload / Next dev)
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Auth listo para Email/Password + Google
export const auth: Auth = getAuth(app);
