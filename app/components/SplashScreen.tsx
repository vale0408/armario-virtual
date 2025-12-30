export default function SplashScreen() {
  return (
    <div className="min-h-dvh av-bg grid place-items-center px-5 py-10">
      <div className="glass-card av-noise w-full max-w-[420px] rounded-[2.4rem] px-7 py-9 text-center">
        <p className="text-[11px] tracking-[0.38em] text-[color:var(--av-ink-soft)]/65">
          ARMARIO VIRTUAL
        </p>

        <h1 className="mt-3 text-[26px] font-medium text-purple-950">
          Preparando tu armario…
        </h1>

        <p className="mt-2 text-sm tracking-wide text-purple-700/60">
          Un segundito 💗
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400/50 animate-bounce [animation-delay:-.2s]" />
          <span className="h-2 w-2 rounded-full bg-purple-400/50 animate-bounce [animation-delay:-.1s]" />
          <span className="h-2 w-2 rounded-full bg-purple-400/50 animate-bounce" />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[color:var(--av-ink-soft)]/55">
        Hecho con 💞 en Bogotá
      </p>
    </div>
  );
}
