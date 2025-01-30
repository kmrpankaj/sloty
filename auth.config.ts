import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";

// For Subdomains
import { db } from "@/lib/db"

// NEW: For tenant user login
import { Organization, TenantUser } from "@prisma/client"
import { z } from "zod"

/**
 * A second credentials provider for TenantUsers (subdomain-based).
 */
const TenantUserCredentials = Credentials({
  // You can name or ID this provider to differentiate it from the main credentials provider
  id: "tenant-user-credentials",
  name: "TenantUserCredentials",
  credentials: {
    email: { type: "text" },
    password: { type: "password" },
    organization: { type: "text" }, // the subdomain or custom domain
  },
  async authorize(credentials) {

    console.log("authorize → received credentials:", credentials);

    if (!credentials) return null;

    // Validate input with your existing LoginSchema or a new schema
    const parsed = LoginSchema.safeParse(credentials);

    console.log("authorize → validatedFields:", parsed);

    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const { organization } = credentials;
    if (!organization) return null;

    // 1) Look up the subdomain or domain in CustomDomain
    const customDomain = await db.customDomain.findFirst({
      where: {
        OR: [
          { domain: organization },
          { subdomain: organization },
        ],
      },
      select: {
        organizationId: true,
      },
    });

    console.log("authorize → customDomain:", customDomain);

    if (!customDomain) return null;

    // 2) Check the TenantUser for that org
    const tenantUser = await db.tenantUser.findFirst({
      where: {
        organizationId: customDomain.organizationId,
        email,
      },
    });

    console.log("authorize → tenantUser:::::::::", tenantUser);


    if (!tenantUser) return null;

    // 3) Compare password
    const isValid = await bcrypt.compare(password, tenantUser.password);

    console.log("authorize → passwordsMatch:", isValid);
    console.log("TenantUserCredentials → isValid:", isValid);
    if (!isValid) return null;

    // If you have an "emailVerified" field in TenantUser, check that if desired
    // if (!tenantUser.emailVerified) return null;

    // 4) Return user object for NextAuth
    // NextAuth needs an object with at least an `id`.
    // We can also pass other info in token callbacks.
    return {
      id: tenantUser.id,                     // The ID for NextAuth
      email: tenantUser.email,               // For session.user.email
      name: tenantUser.name,                 // For session.user.name
      tenantUserId: tenantUser.id,           // Custom field
      organizationId: tenantUser.organizationId, // Custom field
    };
  }
});
// subdomains ends======================================================
const isProduction = process.env.NODE_ENV === "production";
export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        console.log("Main Credentials Provider → Received credentials:", credentials);
        console.log("authorize → received credentials:", credentials);
        const validatedFields = LoginSchema.safeParse(credentials);


        if (validatedFields.success) {
          console.log("authorize → validation successful");
          const { email, password } = validatedFields.data;
          console.log("authorize → validatedFields:", validatedFields.data);

          const user = await getUserByEmail(email);
          console.log("Found global user:", user);

          if (!user || !user.password) {
            console.log("No user or missing password");
            return null;

          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          )
          console.log("Passwords match?", passwordsMatch);

          if (passwordsMatch) {
            console.log("Returning user from main credentials provider");
            return user;
          }

        }
        console.log("Returning null from main credentials provider");
        return null
      }
    }),
    // NEW: TenantUser credentials for subdomain
    TenantUserCredentials,
  ],
  /**
   * Example of setting a wildcard domain so cookies work across subdomains.
   * Adjust domain as needed (e.g. ".example.com").
   */
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        //domain: isProduction ? ".sloty.in" : undefined,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    // Also set "callbackUrl" cookie or "csrfToken" cookie similarly if desired
  },

  // If you want to ensure secure cookies in production
  useSecureCookies: isProduction,
  trustHost: true,
  debug: !isProduction, // Enable debugging for local development


  // 👇 Ensure correct API route is used for subdomains
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig