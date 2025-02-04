"use client";

import React from "react";
import { useGlobalSession } from "@/hooks/global-session-store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { session, loading } = useGlobalSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [loading, session, router]);
console.log(session)
  if (loading) return <p>Loading session...</p>;
  if (!session) return <p>No session found. Redirecting...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>Organization Dashboard</h1>
      <h2>Welcome, {session?.user?.name || "User"}!</h2>
      <p>Email: {session?.user?.email}</p>
      <p>User ID: {session?.user?.id}</p>
    </div>
  );
}