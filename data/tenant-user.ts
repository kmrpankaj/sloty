import { db } from "@/lib/db";

/* Retrieve a TenantUser by just ID (Primary Key). */
export const getTenantUserByOnlyId = async (id: string) => {
  try {
    const tenantUser = await db.tenantUser.findUnique({
      where: { id },
    });
    return tenantUser;
  } catch (error) {
    console.error("Error in getTenantUserByOnlyId:", error);
    return null;
  }
};

/** Retrieve a TenantUser by ID within a specific organization. */
export const getTenantUserById = async (id: string, organizationId: string) => {
  try {
    const tenantUser = await db.tenantUser.findFirst({
      where: {
        id,
        organizationId,
      },
    });
    return tenantUser;
  } catch (error) {
    console.error("Error in getTenantUserById:", error);
    return null;
  }
};

/** Retrieve a TenantUser by email within a specific organization. */
export const getTenantUserByEmail = async (
  organizationId: string,
  email: string
) => {
  try {
    const tenantUser = await db.tenantUser.findFirst({
      where: {
        organizationId,
        email,
      },
    });
    return tenantUser;
  } catch (error) {
    console.error("Error in getTenantUserByEmail:", error);
    return null;
  }
};
