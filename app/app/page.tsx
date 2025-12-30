"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthBackdrop from "../components/AuthBackdrop";

export default function AppHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return null;

  return (
    <AuthBackdrop>
      <div className="glass-card av-noise rounded-[2.4rem] px-6 py-7 text-center">
        <p className="text-[11px] tracking-[0.38em] text-[color:var(--av-ink-soft)]/65">
          ARMARIO VIRTUAL
        </p>

        <h1 className="mt-3 text-[22px] font-medium text-purple-950">
          Ya estás dentro ✨
        </h1>

        <p className="mt-2 text-sm text-purple-700/60">
          Aquí va tu Home (Armario/Outfits/etc).
        </p>
      </div>
    </AuthBackdrop>
  );
}
