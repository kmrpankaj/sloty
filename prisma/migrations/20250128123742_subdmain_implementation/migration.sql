-- DropIndex
DROP INDEX "tenant_users_email_key";

-- AlterTable
ALTER TABLE "tenant_users" ADD COLUMN     "emailVerified" TIMESTAMP(3);
