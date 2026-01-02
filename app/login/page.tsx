"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthError,
} from "firebase/auth";

import AuthBackdrop from "../components/AuthBackdrop";
import { auth } from "../../lib/firebase";
import { useAuth } from "../context/AuthContext";

/**
 * PASO 1:
 * Mostrar el código REAL del error de Firebase
 */
function firebaseErrorToSpanish(err: unknown) {
  const code = (err as AuthError)?.code || "unknown";

  switch (code) {
    case "auth/invalid-email":
      return "Ese email no es válido.";
    case "auth/missing-password":
      return "Escribe tu contraseña.";
    case "auth/invalid-credential":
      return "Email o contraseña incorrectos.";
    case "auth/user-not-found":
      return "No existe una cuenta con ese email.";
    case "auth/wrong-password":
      return "Contraseña incorrecta.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";
    case "auth/popup-closed-by-user":
      return "Cerraste el inicio de sesión con Google.";
    case "auth/cancelled-popup-request":
      return "Se canceló el popup. Intenta de nuevo.";
    case "auth/unauthorized-domain":
      return "Dominio no autorizado en Firebase.";
    case "auth/network-request-failed":
      return "Error de red. Revisa tu conexión.";
    default:
      // 👇 CLAVE
      return `No se pudo iniciar sesión (${code}).`;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const googleProvider = useMemo(() => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    return p;
  }, []);

  // Si ya hay usuario, saca de /login
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleGoogleLogin() {
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/");
    } catch (err) {
      console.error("[AUTH GOOGLE ERROR]", err);
      setErrorMsg(firebaseErrorToSpanish(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (err) {
      console.error("[AUTH EMAIL ERROR]", err);
      setErrorMsg(firebaseErrorToSpanish(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <AuthBackdrop>
      <div className="glass-card av-noise rounded-[2.4rem] px-6 py-7 sm:px-7 sm:py-8">
        {/* header */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.38em] text-[color:var(--av-ink-soft)]/70">
            ARMARIO VIRTUAL
          </p>

          <h1 className="mt-2 text-[26px] font-medium text-purple-950">
            Bienvenida
          </h1>

          <p className="mt-3 text-sm tracking-wide text-purple-700/60">
            Crea outfits y combina sin pensar de más.
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="btn-soft mt-6 w-full rounded-2xl py-3.5 font-semibold text-[color:var(--av-ink)]
                     active:scale-[0.99] transition disabled:opacity-60"
        >
          Continuar con Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-[12px] tracking-wide text-purple-800/55">
            o continuar con email
          </span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        {/* Email */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Email
            </label>
            <input
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-[color:var(--av-ring)]"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Contraseña
            </label>
            <input
              type="password"
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-[color:var(--av-ring)]"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gradient mt-2 w-full rounded-2xl py-3.5 font-bold text-white
                   hover:brightness-[1.03] active:scale-[0.99] transition disabled:opacity-70"
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>

          {/* ERROR */}
          {errorMsg ? (
            <p className="text-center text-[12px] text-red-600/90">
              {errorMsg}
            </p>
          ) : null}

          <p className="pt-2 text-center text-[12px] text-[color:var(--av-ink-soft)]/65">
            Al continuar aceptas guardar tu armario de forma segura 💗
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[color:var(--av-ink-soft)]/55">
        Hecho con 💞 en Bogotá
      </p>
    </AuthBackdrop>
  );
}
