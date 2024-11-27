import { db } from "@/lib/db";

// Fetch tenant by ID
export const getTenantById = async (id: string) => {
  try {
    const tenant = await db.tenant.findUnique({
      where: { id },
    });

    return tenant;
  } catch (error) {
    console.error(`Error fetching tenant by ID (${id}):`, error);
    return null;
  }
};


export const getTenantIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (user?.tenantId) {
      console.log("Found tenantId via user:", user.tenantId);
      return user.tenantId;
    }

    console.log("No tenantId found for userId:", userId);
    return null;
  } catch (error) {
    console.error(`Error fetching tenantId for userId (${userId}):`, error);
    return null;
  }
};

