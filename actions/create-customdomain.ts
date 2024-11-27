"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { CreateCustomDomainSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";

export const createCustomDomain = async (data: z.infer<typeof CreateCustomDomainSchema>) => {

  // Retrieve the session
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" }
}

  const mytenant = user.tenantId;
  if (!mytenant) {
    return { error: "Tenant ID not found in session." };
  }


    const validatedFields = CreateCustomDomainSchema.safeParse(data);
  
    if (!validatedFields.success) {
      return { error: "Invalid custom domain data!" };
    }
  
    const { domain, subdomain, organizationId } = validatedFields.data;
  
    try {
      const customDomain = await db.customDomain.create({
        data: {
          domain,
          subdomain,
          tenantId: mytenant,
          organizationId,
          domainVerified: false, // Default to unverified
        },
      });
  
      return { success: "Custom domain created successfully!", customDomain };
    } catch (error) {
      console.error("Error creating custom domain:", error);
      return { error: "Failed to create custom domain." };
    }
  };