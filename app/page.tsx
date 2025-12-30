"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";

export default function HomeGate() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) router.replace("/app");
    else router.replace("/login");
  }, [user, loading, router]);

  return <SplashScreen />;
}
