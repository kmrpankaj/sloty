"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getTenantUserByEmail } from "@/data/tenant-user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * Registers a new TenantUser within a specific organization.
 * @param organizationId The ID of the organization (already validated in layout).
 * @param values The user input for registration (email, password, name).
 * @returns An object with either {success: string} or {error: string}.
 */
export const registerTenantUser = async (
  organizationId: string,
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    // 1) Validate input fields
    const validated = RegisterSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password, name } = validated.data;

    // 2) Check if TenantUser already exists in this organization
    const existingTenantUser = await getTenantUserByEmail(organizationId, email);
    if (existingTenantUser) {
      return { error: "Email already in use in this organization." };
    }

    // 3) Check or create a global User
    let globalUser = await db.user.findUnique({ where: { email } });
    if (!globalUser) {
      globalUser = await db.user.create({
        data: {
          email,
          name,
          role: undefined, // No role for global user
        },
      });
    }

    if (!organizationId) {
        throw new Error("Invalid organizationId: Cannot create a TenantUser without a valid organizationId.");
      }

    // 4) Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5) Create the TenantUser
    const tenantUser = await db.tenantUser.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "TENANT_USER", // Default tenant-specific role
        organizationId,
        userId: globalUser.id,
      },
    });

    console.log("TenantUser created successfully:", tenantUser);

    // 6) Generate a verification token and send email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent! Please verify your email."};
  } catch (error) {
    console.error("Error in registerTenantUser:", error);
    return { error: "An error occurred during registration." };
  }
};

