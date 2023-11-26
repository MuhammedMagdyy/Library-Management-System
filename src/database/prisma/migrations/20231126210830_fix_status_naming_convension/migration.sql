/*
  Warnings:

  - The `status` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Borrowing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE', 'BORROWED', 'RETURNED');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Borrowing" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'BORROWED';

-- DropEnum
DROP TYPE "STATUS";
