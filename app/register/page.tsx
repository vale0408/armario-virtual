"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
  type AuthError,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import AuthBackdrop from "../components/AuthBackdrop";
import { auth, db } from "../../lib/firebase";

function firebaseErrorToSpanish(err: unknown) {
  const code = (err as AuthError)?.code || "unknown";

  switch (code) {
    case "auth/invalid-email":
      return "Ese email no es válido.";
    case "auth/email-already-in-use":
      return "Ese email ya tiene cuenta. Ve a Entrar.";
    case "auth/weak-password":
      return "La contraseña es muy débil.";
    case "auth/operation-not-allowed":
      return "Este método no está habilitado en Firebase Auth.";
    case "auth/popup-closed-by-user":
      return "Cerraste el inicio de sesión con Google.";
    case "auth/network-request-failed":
      return "Error de red. Revisa tu conexión.";
    default:
      return `No se pudo crear la cuenta (${code}).`;
  }
}

function isStrongPassword(pw: string) {
  const min = pw.length >= 8;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const number = /[0-9]/.test(pw);
  const symbol = /[^A-Za-z0-9]/.test(pw);
  return min && upper && lower && number && symbol;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Timeout para que NUNCA se quede pegado
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

const CITY_OPTIONS = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Otra"];
const STYLE_OPTIONS = [
  "Girly",
  "Minimal",
  "Coquette",
  "Old money",
  "Streetwear",
  "Casual",
  "Formal",
  "Otro",
];

function SuccessModal({
  open,
  title,
  subtitle,
  buttonText,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  buttonText: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-6">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md glass-card av-noise rounded-[2.2rem] px-6 py-6 text-center shadow-xl">
        <h2 className="text-[22px] font-semibold text-purple-950">{title}</h2>
        {subtitle ? (
          <p className="mt-2 text-sm text-purple-700/70">{subtitle}</p>
        ) : null}

        <button
          onClick={onClose}
          className="btn-gradient mt-5 w-full rounded-2xl py-3.5 font-bold text-white
                     hover:brightness-[1.03] active:scale-[0.99] transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [city, setCity] = useState("Bogotá");
  const [cityOther, setCityOther] = useState("");

  const [style, setStyle] = useState("Girly");
  const [styleOther, setStyleOther] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);

  const googleProvider = useMemo(() => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    return p;
  }, []);

  function finalCity() {
    return city === "Otra" ? cityOther.trim() : city;
  }

  function finalStyle() {
    return style === "Otro" ? styleOther.trim() : style;
  }

  async function saveProfileToFirestore(uid: string, userEmail?: string | null) {
    await setDoc(
      doc(db, "users", uid),
      {
        name: name.trim() || null,
        city: finalCity() || null,
        style: finalStyle() || null,
        email: userEmail ?? null,
        createdAt: serverTimestamp(),
        onboardingCompleted: true,
      },
      { merge: true }
    );
  }

  async function handleRegisterEmail(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setErrorMsg(null);

    const cleanEmail = email.trim();

    if (!name.trim()) return setErrorMsg("Escribe tu nombre.");
    if (!isValidEmail(cleanEmail)) return setErrorMsg("Ese email no es válido.");

    if (city === "Otra" && !cityOther.trim())
      return setErrorMsg("Escribe tu ciudad.");
    if (style === "Otro" && !styleOther.trim())
      return setErrorMsg("Escribe tu estilo (o elige uno).");

    if (!isStrongPassword(password)) {
      return setErrorMsg(
        "Contraseña débil. Usa 8+ caracteres, mayúscula, minúscula, número y símbolo."
      );
    }

    setSubmitting(true);

    try {
      const cred = await withTimeout(
        createUserWithEmailAndPassword(auth, cleanEmail, password),
        15000
      );

      // Best effort: nombre
      try {
        await withTimeout(updateProfile(cred.user, { displayName: name.trim() }), 8000);
      } catch {}

      // Best effort: Firestore
      try {
        await withTimeout(saveProfileToFirestore(cred.user.uid, cleanEmail), 10000);
      } catch {}

      // Best effort: cerrar sesión para que vuelva a login
      try {
        await withTimeout(signOut(auth), 8000);
      } catch {}

      setSuccessOpen(true);
    } catch (err) {
      console.error("[REGISTER EMAIL ERROR]", err);
      if ((err as Error)?.message === "timeout") {
        setErrorMsg("Se está demorando demasiado. Revisa tu internet y vuelve a intentar.");
      } else {
        setErrorMsg(firebaseErrorToSpanish(err));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterGoogle() {
    if (submitting) return;

    setErrorMsg(null);

    if (!name.trim()) return setErrorMsg("Escribe tu nombre.");
    if (city === "Otra" && !cityOther.trim())
      return setErrorMsg("Escribe tu ciudad.");
    if (style === "Otro" && !styleOther.trim())
      return setErrorMsg("Escribe tu estilo (o elige uno).");

    setSubmitting(true);

    try {
      const cred = await withTimeout(signInWithPopup(auth, googleProvider), 15000);

      try {
        await withTimeout(updateProfile(cred.user, { displayName: name.trim() }), 8000);
      } catch {}

      try {
        await withTimeout(saveProfileToFirestore(cred.user.uid, cred.user.email), 10000);
      } catch {}

      try {
        await withTimeout(signOut(auth), 8000);
      } catch {}

      setSuccessOpen(true);
    } catch (err) {
      console.error("[REGISTER GOOGLE ERROR]", err);
      if ((err as Error)?.message === "timeout") {
        setErrorMsg("Se está demorando demasiado. Revisa tu internet y vuelve a intentar.");
      } else {
        setErrorMsg(firebaseErrorToSpanish(err));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthBackdrop>
      <SuccessModal
        open={successOpen}
        title="¡Cuenta creada! ✨"
        subtitle="Ahora inicia sesión para entrar a tu Armario Virtual."
        buttonText="Ir a iniciar sesión"
        onClose={() => {
          setSuccessOpen(false);
          router.replace("/login");
        }}
      />

      <div className="glass-card av-noise rounded-[2.4rem] px-6 py-7 sm:px-7 sm:py-8">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.38em] text-[color:var(--av-ink-soft)]/70">
            ARMARIO VIRTUAL
          </p>
          <h1 className="mt-2 text-[26px] font-medium text-purple-950">
            Crear cuenta
          </h1>
          <p className="mt-3 text-sm tracking-wide text-purple-700/60">
            Cuéntanos un poquito de ti para personalizar tu experiencia ✨
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegisterGoogle}
          disabled={submitting}
          className="btn-soft mt-6 w-full rounded-2xl py-3.5 font-semibold text-[color:var(--av-ink)]
                     active:scale-[0.99] transition disabled:opacity-60"
        >
          {submitting ? "Creando..." : "Crear cuenta con Google"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-[12px] tracking-wide text-purple-800/55">
            o con email
          </span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        <form onSubmit={handleRegisterEmail} className="space-y-3">
          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Nombre (para tus outfits)
            </label>
            <input
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--av-ring)]"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          {/* ✅ CIUDAD (select bonito) */}
          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Ciudad
            </label>

            <div className="relative">
              <select
                className="soft-input mt-1 w-full rounded-2xl px-4 py-3 pr-10
                           outline-none appearance-none
                           bg-white text-purple-900
                           focus:ring-2 focus:ring-[color:var(--av-ring)]"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={submitting}
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* flecha aesthetic */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                ▾
              </span>
            </div>

            {city === "Otra" ? (
              <input
                className="soft-input mt-2 w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--av-ring)]"
                placeholder="Escribe tu ciudad"
                value={cityOther}
                onChange={(e) => setCityOther(e.target.value)}
                disabled={submitting}
                required
              />
            ) : null}
          </div>

          {/* ✅ ESTILO (select bonito) */}
          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Estilo (opcional)
            </label>

            <div className="relative">
              <select
                className="soft-input mt-1 w-full rounded-2xl px-4 py-3 pr-10
                           outline-none appearance-none
                           bg-white text-purple-900
                           focus:ring-2 focus:ring-[color:var(--av-ring)]"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                disabled={submitting}
              >
                {STYLE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* flecha aesthetic */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
                ▾
              </span>
            </div>

            {style === "Otro" ? (
              <input
                className="soft-input mt-2 w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--av-ring)]"
                placeholder="Escribe tu estilo"
                value={styleOther}
                onChange={(e) => setStyleOther(e.target.value)}
                disabled={submitting}
                required
              />
            ) : null}
          </div>

          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">
              Email
            </label>
            <input
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--av-ring)]"
              placeholder="tuemail@gmail.com"
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
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--av-ring)]"
              placeholder="Mínimo 8, con símbolo"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
            <p className="mt-1 text-[11px] text-purple-700/50">
              8+ caracteres, mayúscula, minúscula, número y símbolo.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gradient mt-2 w-full rounded-2xl py-3.5 font-bold text-white
                   hover:brightness-[1.03] active:scale-[0.99] transition disabled:opacity-70"
          >
            {submitting ? "Creando..." : "Crear cuenta"}
          </button>

          {errorMsg ? (
            <p className="text-center text-[12px] text-red-600/90">{errorMsg}</p>
          ) : null}

          <button
            type="button"
            disabled={submitting}
            onClick={() => router.replace("/login")}
            className="w-full text-center text-[12px] text-purple-700/60 hover:underline disabled:opacity-60"
          >
            Ya tengo cuenta → Entrar
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[color:var(--av-ink-soft)]/55">
        Hecho con 💞 en Bogotá
      </p>
    </AuthBackdrop>
  );
}
