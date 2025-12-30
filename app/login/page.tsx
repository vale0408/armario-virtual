import AuthBackdrop from "../components/AuthBackdrop";

export default function LoginPage() {
  return (
    <AuthBackdrop>
      <div className="glass-card av-noise rounded-[2.4rem] px-6 py-7 sm:px-7 sm:py-8">
        {/* header */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.38em] text-[color:var(--av-ink-soft)]/70">
            ARMARIO VIRTUAL
          </p>

          <h1 className="title-girly mt-2 text-[34px] leading-tight text-[color:var(--av-ink)]">
            Bienvenida <span className="align-middle">✨</span>
          </h1>

          <p className="mt-2 text-sm text-[color:var(--av-ink-soft)]/80">
            Crea outfits y combina sin pensar de más.
          </p>
        </div>

        {/* google */}
        <button
          className="btn-soft mt-6 w-full rounded-2xl py-3.5 font-semibold text-[color:var(--av-ink)]
                     active:scale-[0.99] transition"
        >
          Continuar con Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-[12px] text-[color:var(--av-ink-soft)]/65">
            o continuar con email
          </span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        {/* form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">Email</label>
            <input
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-[color:var(--av-ring)]"
              placeholder="tuemail@gmail.com"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs text-[color:var(--av-ink-soft)]/80">Contraseña</label>
            <input
              type="password"
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-[color:var(--av-ring)]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn-gradient mt-2 w-full rounded-2xl py-3.5 font-bold text-white
                       active:scale-[0.99] transition"
          >
            Entrar
          </button>

          <p className="pt-2 text-center text-[12px] text-[color:var(--av-ink-soft)]/65">
            Al continuar aceptas guardar tu armario de forma segura 💗
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[color:var(--av-ink-soft)]/55">
        Hecho con 💞 en Bogotá
      </p>
    </AuthBackdrop>
  );
}
