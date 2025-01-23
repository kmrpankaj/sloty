"use server";

import { getDomain } from "@/data/organization";

/**
 * Validates if the provided domain or subdomain exists.
 * @param {string} domain - The domain or subdomain to validate.
 * @returns {Promise<{ success?: { message: string; organizationId: string; organizationName: string }; error?: string }>} - Returns success with organizationId or error message.
 */
export const validateDomain = async (domain: string) => {
  //console.log("validateDomain → Received domain:", domain);
  try {
    const domainData = await getDomain(domain);
    //console.log("validateDomain → domainData:", domainData);

    if (domainData) {
      return { success: {message: "Valid domain or subdomain", organizationId: domainData.organizationId,
        organizationName: domainData.organizationName,
      } };
    }

    return { error: "Invalid domain or subdomain" };
  } catch (error) {
    console.error("Error validating domain:", error);
    return { error: "Server error occurred while validating domain" };
  }
};
