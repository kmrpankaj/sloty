// app/[organization]/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { loginTenantUser } from "@/actions/login-tenant-user";
import { useOrganization } from "@/hooks/use-organization"; // If you want to display orgName

export default function TenantLoginPage() {
  const { organization } = useParams() as { organization: string }; // e.g. "bookbuddy"
  const { organizationId, organizationName, error: orgError } = useOrganization();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const { update } = useSession();

  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");

    startTransition(async () => {
      // Call our separate tenant login server action
      const result = await loginTenantUser(organization, values, callbackUrl);

      if (result.error) {
        setError(result.error);
        form.reset();
        return;
      }

      if (result.redirectTo) {
        // Refresh session, then navigate
        await update();
        router.push(result.redirectTo);
      }
    });
  }

  // If subdomain is invalid, show error
  if (orgError) {
    return <div className="p-6">Error: {orgError}</div>;
  }

  // Or if still loading org info
  if (!organizationId) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1>Login to {organizationName || organization}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            {...form.register("email")}
            type="email"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            {...form.register("password")}
            type="password"
            className="border p-2 w-full"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
