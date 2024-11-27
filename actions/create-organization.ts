"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { CreateOrganizationSchema } from "@/schemas";
import { getTenantById } from "@/data/tenant"; 
import { createCustomDomain } from "@/actions/create-customdomain";
import { currentUser } from "@/lib/auth";

export const createOrganization = async (values: z.infer<typeof CreateOrganizationSchema>) => {

    // Retrieve the session
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" }
  }
  
    const mytenant = user.tenantId;
    if (!mytenant) {
      return { error: "Tenant ID not found in session." };
    }


  const validatedFields = CreateOrganizationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, planType, domain, subdomain } = validatedFields.data;

  // Ensure tenant exists
  const tenant = await getTenantById(mytenant);
  if (!tenant) {
    return { error: { tenantId: ["Invalid tenant ID"] } };
  }

  try {
    // Create the organization
    const organization = await db.organization.create({
      data: {
        name,
        planType,
        tenantId: mytenant,
        subscriptionStatus: true, // Automatically set subscriptionStatus to true
      },
    });

     // If a custom domain is provided, create the custom domain record
     if (subdomain) {
        const domainResult = await createCustomDomain({
          domain: domain || undefined,
          subdomain,
          organizationId: organization.id,
        });
  
        if (domainResult.error) {
          throw new Error(domainResult.error);
        }
      }


    return { success: "Organization created successfully!" };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { error: "Something went wrong while creating the organization." };
  }
};
