/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Duck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Duck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Duck" ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Duck_number_key" ON "Duck"("number");
