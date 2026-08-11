-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "creatorNotes" TEXT,
ADD COLUMN     "deliverableUrl" TEXT;
