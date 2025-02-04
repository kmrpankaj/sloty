"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { loginTenantUser } from "@/actions/login-tenant-user";
import { useOrganization } from "@/hooks/use-organization";
import { LoginForm } from "@/components/tenant-user-login-form";

export default function TenantLoginPage() {
  // 1) Extract subdomain/org from the URL
  const { organization } = useParams() as { organization: string };
  const { organizationId, organizationName, error: orgError } = useOrganization();

  // 2) Handle query params, NextAuth session, navigation
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { update } = useSession();
  const router = useRouter();

  // 3) Local error & loading states
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // 4) Set up react-hook-form with zod
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 5) Submission logic calling our server action
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await loginTenantUser(organization, values, callbackUrl);

      if (result.error) {
        setError(result.error);
        form.reset();
        return;
      }
      if (result.success) {
        setSuccess(result.message);
      }
      if (result.redirectTo) {
        // Refresh NextAuth session & redirect
        await update();
        router.push(result.redirectTo);
        router.refresh(); // 🔹 Force revalidation of session
      }
    });
  }

  // 6) Handle invalid org or loading states
  if (orgError) {
    return <div className="p-6">Error: {orgError}</div>;
  }
  if (!organizationId) {
    return <div className="p-6">Loading...</div>;
  }

  // 7) Render your custom LoginForm with the needed props
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          onSubmit={form.handleSubmit(onSubmit)}
          register={form.register}
          isPending={isPending}
          error={error}
          success={success}
          organizationName={organizationName || organization}
        />
      </div>
    </div>
  );
}
