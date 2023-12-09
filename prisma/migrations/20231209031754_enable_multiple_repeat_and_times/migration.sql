/*
  Warnings:

  - You are about to drop the column `startDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Repeat_taskId_key";

-- AlterTable
ALTER TABLE "Repeat" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "times" JSONB,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "interval" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "startDate",
DROP COLUMN "times";

-- DropEnum
DROP TYPE "DayOfWeek";
