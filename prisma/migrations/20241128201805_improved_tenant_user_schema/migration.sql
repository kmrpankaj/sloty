/*
  Warnings:

  - You are about to drop the column `tenantId` on the `custom_domains` table. All the data in the column will be lost.
  - You are about to drop the `user_organizations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,domain]` on the table `custom_domains` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "custom_domains" DROP CONSTRAINT "custom_domains_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "user_organizations" DROP CONSTRAINT "user_organizations_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "user_organizations" DROP CONSTRAINT "user_organizations_userId_fkey";

-- DropIndex
DROP INDEX "custom_domains_tenantId_domain_key";

-- AlterTable
ALTER TABLE "custom_domains" DROP COLUMN "tenantId",
ALTER COLUMN "subdomain" DROP NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "user_organizations";

-- CreateTable
CREATE TABLE "tenant_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "tenant_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_users_email_key" ON "tenant_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_users_organizationId_email_key" ON "tenant_users"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "custom_domains_organizationId_domain_key" ON "custom_domains"("organizationId", "domain");

-- AddForeignKey
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_users" ADD CONSTRAINT "tenant_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
