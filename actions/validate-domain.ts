"use server";

import { getDomain } from "@/data/organization";

/**
 * Validates if the provided domain or subdomain exists.
 * @param {string} domain - The domain or subdomain to validate.
 * @returns {Promise<{ success?: string; error?: string }>} - Returns success or error message.
 */
export const validateDomain = async (domain: string) => {
    console.log("validateDomain → Received domain:", domain);
  try {
    const isValid = await getDomain(domain);
    console.log("validateDomain → isValid:", isValid);

    if (isValid) {
      return { success: "Valid domain or subdomain" };
    }

    return { error: "Invalid domain or subdomain" };
  } catch (error) {
    console.error("Error validating domain:", error);
    return { error: "Server error occurred while validating domain" };
  }
};
