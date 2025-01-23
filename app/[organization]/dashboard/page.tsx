"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      //const subdomain = window.location.hostname.split(".")[0];
      router.push(`/login`);
    }

  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Organization Dashboard</h1>
      <h2>Welcome, {session?.user?.name || "User"}!</h2>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <p>Tenant ID: {session?.user?.tenantId}</p>
    </div>
  );
}
