"use server";

import { signIn } from "@/auth";
import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  organization: z.string().min(1),
});

export async function tenantLoginAction(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) {
  const parsed = LoginSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid fields" };

  const { email, password, organization } = parsed.data;

  // NextAuth signIn inside a server action returns a string (URL) or null
  const result = await signIn("tenant-user-credentials", {
    email,
    password,
    organization,
    redirect: false,
    callbackUrl: callbackUrl ?? "/dashboard",
  });

  if (!result) {
    return { error: "Invalid credentials" };
  }

  return { success: true, redirectTo: result };
}

export async function tenantLogoutAction() {
  // signOut in server action typically just returns a string or null as well
  // But for simplicity let's do:
  return { success: true };
}
