import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { getTenantIdByUserId } from "@/data/tenant";


export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      //allow oAuth without email veirfication
      if (account?.provide !== "credentials") return true;

      if (!user.id) {
        // Handle the case where user.id is undefined
        return false;
      }

      const existingUser = await getUserById(user.id);

      //prevent signin without email verification
      if (!existingUser?.emailVerified) return false;

      // 2fa check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }


      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token })
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {

        if (token.name) {
          session.user.name = token.name;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        session.user.isOAuth = token.isOAuth as boolean;

        if (token.tenantId) {
          session.user.tenantId = token.tenantId as string | null; // Add tenantId to session.user
        }
        
      }

      return session;
    },

    async jwt({ token }) {

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      )
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      // Fetch tenantId associated with the user
      token.tenantId = existingUser.tenantId || null; // Add tenantId to the token
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,

})