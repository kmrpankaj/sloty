import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPPORT, UserRole.MODERATOR]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }
        return true;
    }, {
        message: "Password is required!",
        path: ["password"]
    })

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required",
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of six characters required",
    }),
});


export const CreateOrganizationSchema = z.object({
    name: z
      .string()
      .min(2, "Organization name must be at least 2 characters long")
      .min(1, "Organization name is required"),
    planType: z
      .string()
      .min(1, "Plan type is required")
      .refine(
        (value) => ["basic", "standard", "premium"].includes(value),
        "Plan type must be one of: basic, standard, premium"
      ),
    subdomain: z
      .string()
      .min(1, "Subdomain is required")
      .regex(/^[a-z0-9]+$/, "Subdomain must be lowercase and alphanumeric"),
      domain: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        "Invalid custom domain format"
      ),
  });


export const CreateCustomDomainSchema = z.object({
    domain: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        "Invalid custom domain format"
      ),
    subdomain: z
      .string()
      .min(1, "Subdomain is required") // Replaces .nonempty()
      .regex(/^[a-z0-9]+$/, "Subdomain must be lowercase and alphanumeric"),
    organizationId: z.string().min(1, "Organization ID is required"), // Replaces .nonempty()
  });
