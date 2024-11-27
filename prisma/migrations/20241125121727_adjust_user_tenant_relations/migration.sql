/*
  Warnings:

  - Added the required column `planType` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionStatus` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "planType" TEXT NOT NULL,
ADD COLUMN     "subscriptionStatus" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tenantId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
