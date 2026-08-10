/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `CreatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `CreatorProfile` table. All the data in the column will be lost.
  - You are about to drop the `ClientProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientProfile" DROP CONSTRAINT "ClientProfile_userId_fkey";

-- AlterTable
ALTER TABLE "CreatorProfile" DROP COLUMN "hourlyRate",
DROP COLUMN "skills",
ADD COLUMN     "averageViews" INTEGER,
ADD COLUMN     "engagementRate" DOUBLE PRECISION,
ADD COLUMN     "followers" INTEGER,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "niches" TEXT,
ADD COLUMN     "platforms" TEXT,
ADD COLUMN     "socialLinks" TEXT;

-- DropTable
DROP TABLE "ClientProfile";

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT,
    "bio" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "socialLinks" TEXT,
    "location" TEXT,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
