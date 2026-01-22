/*
  Warnings:

  - Added the required column `order` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "order" TEXT NOT NULL;
