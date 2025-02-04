"use client";

import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    console.log("status:", status)
    console.log("session:", session)
    if (status === "unauthenticated") {
      //const subdomain = window.location.hostname.split(".")[0];
      router.push(`/login`);
    }

    if (status === "loading") {
      // Ensure session is correctly fetched from the root domain
      getSession().then((fetchedSession) => {
        if (fetchedSession) {
          console.log("Fetched session manually:", fetchedSession);
          update(); // Sync NextAuth state
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

  }, [status, router, update]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Organization Dashboard</h1>
      <h2>Welcome, {session?.user?.name || "User"}!</h2>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
      <p>User ID: {session?.user?.id}</p>
    </div>
  );
}