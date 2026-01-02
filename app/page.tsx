"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";

const MIN_SPLASH_MS = 1600; // ajusta: 1200 - 2200 a gusto

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // espera a que Firebase resuelva + a que pase el mínimo
    if (!loading && minTimeDone) {
      router.replace(user ? "/app" : "/login");
    }
  }, [loading, minTimeDone, user, router]);

  return <SplashScreen />;
}
