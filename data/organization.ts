import { db } from "@/lib/db";

/**
 * Checks if a custom domain or subdomain exists.
 * @param {string} value - The domain or subdomain to check.
 * @returns {Promise<{ organizationId: string } | null>} - Returns organizationId if found, otherwise null.
 */
export const getDomain = async (value: string): Promise<{ organizationId: string } | null> => {
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
      select: { organizationId: true },
    });
    console.log("getDomain → Found?", !!customDomain);
    // If found, return the organizationId
    if (customDomain?.organizationId) {
      return { organizationId: customDomain.organizationId };
    }
    return null;
  } catch (error) {
    console.error("Error in getDomain:", error);
    return null;
  }
};
