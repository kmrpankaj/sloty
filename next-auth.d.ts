import NextAuth, {DefaultSession} from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    tenantId?: string | null; 
}

declare module "next-auth" {
    interface Session {
      user: ExtendedUser;
    }

    interface User extends ExtendedUser {} 

    interface JWT {
      tenantId?: string | null;
      isOAuth?: boolean;
      role?: UserRole;
      isTwoFactorEnabled?: boolean;
      name?: string | null;
      email?: string | null;
      sub?: string; // The user's ID
    }
    
  }

  
