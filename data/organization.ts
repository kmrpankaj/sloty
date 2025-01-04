import { db } from "@/lib/db";

/**
 * Checks if a custom domain or subdomain exists.
 * @param {string} value - The domain or subdomain to check.
 * @returns {Promise<boolean>} - Returns true if a domain or subdomain exists, otherwise false.
 */
export const getDomain = async (value: string): Promise<boolean> => {
    console.log("getDomain → Checking:", value);
  try {
    // Check for custom domain
    const customDomain = await db.customDomain.findFirst({
      where: {
        OR: [
          { domain: value }, // Check for custom domain
          { subdomain: value }, // Check for subdomain
        ],
      },
    });
    console.log("getDomain → Found?", !!customDomain);
    // Return true if found, false otherwise
    return !!customDomain;
  } catch(error) {
    console.error("Error in getDomain:", error);
    return false;
  }
};
