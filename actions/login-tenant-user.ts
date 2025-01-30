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

  console.log("loginTenantUser → Received request with values:", values);
  console.log("loginTenantUser → Organization subdomain:", organization);
  console.log("loginTenantUser → Callback URL:", callbackUrl);


  // 1) Validate the input using your existing schema
  const validated = LoginSchema.safeParse(values);
  console.log("loginTenantUser → Validated fields:", validated);
  if (!validated.success) {
    console.log("loginTenantUser → Validation failed. Returning error.");
    return { error: "Invalid fields!" };
  }

  const { email, password } = validated.data; // or code, if you have 2FA
  if (!organization) {

    console.log("loginTenantUser → Missing organization subdomain.");

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

    console.log("signIn response res:", res);
    // 3) signIn returns: { error?: string; ok: boolean; status?: number; url?: string }
    if (!res.ok) {
      console.log("loginTenantUser → Sign-in failed:", res.error);
      return { error: res.error || "Invalid credentials" };
    }

    console.log("✅loginTenantUser → Sign-in success! Redirecting to:", res.url);
    // 4) If success, redirect to res.url (usually the callbackUrl)
    return { redirectTo: res.url };

  } catch (error) {
    console.error("loginTenantUser → Error during sign-in:", error);
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
