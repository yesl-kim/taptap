/*
  Warnings:

  - You are about to drop the column `userId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner,title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropIndex
DROP INDEX "Category_userId_title_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "userId",
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "DayOfWeek";

-- CreateIndex
CREATE UNIQUE INDEX "Category_owner_title_key" ON "Category"("owner", "title");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
