import AuthBackdrop from "../components/AuthBackdrop";

export default function LoginPage() {
  return (
    <AuthBackdrop>
      <div className="glass-card av-noise rounded-[2.2rem] p-6">
        {/* header */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.35em] text-purple-700/60">ARMARIO VIRTUAL</p>
          <h1 className="title-girly mt-2 text-[34px] leading-tight text-purple-950">
            Bienvenida <span className="align-middle">✨</span>
          </h1>
          <p className="mt-2 text-sm text-purple-800/70">
            Guarda tus prendas, arma outfits y prueba combinaciones.
          </p>
        </div>

        {/* google */}
        <button
          className="btn-soft mt-6 w-full rounded-2xl py-3.5 font-semibold text-purple-950
                     active:scale-[0.99] transition"
        >
          Continuar con Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/60" />
          <span className="text-[12px] text-purple-800/60">o con email</span>
          <div className="h-px flex-1 bg-white/60" />
        </div>

        {/* form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-purple-900/70">Email</label>
            <input
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-fuchsia-200"
              placeholder="tuemail@gmail.com"
            />
          </div>

          <div>
            <label className="text-xs text-purple-900/70">Contraseña</label>
            <input
              type="password"
              className="soft-input mt-1 w-full rounded-2xl px-4 py-3 outline-none
                         focus:ring-2 focus:ring-fuchsia-200"
              placeholder="••••••••"
            />
          </div>

          <button
            className="btn-gradient mt-2 w-full rounded-2xl py-3.5 font-bold text-white
                       active:scale-[0.99] transition"
          >
            Entrar
          </button>

          <p className="pt-2 text-center text-[12px] text-purple-800/60">
            Al continuar aceptas guardar tu armario de forma segura 💗
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-purple-900/50">
        Hecho con 💞 en Bogotá
      </p>
    </AuthBackdrop>
  );
}
