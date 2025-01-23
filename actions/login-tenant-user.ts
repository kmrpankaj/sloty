// actions/login-tenant-user.ts
"use server";

import * as z from "zod";
import { signIn } from "@/auth"; // your re-export of next-auth signIn
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

/**
 * Logs in a TenantUser using the new "tenant-user-credentials" provider.
 * @param organization subdomain or domain from the route param
 * @param values The login form data (email, password, code, etc.)
 * @param callbackUrl Optional URL to redirect after success
 */
export const loginTenantUser = async (
  organization: string,
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  // 1) Validate the input using your existing schema
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validated.data; // or code, if you have 2FA
  if (!organization) {
    return { error: "Missing organization subdomain." };
  }

  try {
    // 2) Attempt sign in using our tenant-user credentials
    const res = await signIn("tenant-user-credentials", {
      email,
      password,
      organization,
      redirect: false, // We'll handle the redirect manually
      callbackUrl: callbackUrl ?? "/dashboard",
    });

    // 3) signIn returns: { error?: string; ok: boolean; status?: number; url?: string }
    if (!res.ok) {
      return { error: res.error || "Invalid credentials" };
    }

    // 4) If success, redirect to res.url (usually the callbackUrl)
    return { redirectTo: res.url };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    return { error: "Something went wrong" };
  }
};
