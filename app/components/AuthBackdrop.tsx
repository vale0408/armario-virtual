export default function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh av-bg flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute top-16 -right-20 h-80 w-80 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-fuchsia-200/35 blur-3xl" />
      </div>

      {/* content */}
      <div className="relative w-full max-w-sm">{children}</div>

      {/* sparkles */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <svg className="absolute left-6 top-10" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l1.2 5.2L18 8.5l-4.8 1.3L12 15l-1.2-5.2L6 8.5l4.8-1.3L12 2Z" fill="white"/>
        </svg>
        <svg className="absolute right-8 top-28" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4l.9 4L16 9l-3.1 1L12 14l-.9-4L8 9l3.1-1L12 4Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
