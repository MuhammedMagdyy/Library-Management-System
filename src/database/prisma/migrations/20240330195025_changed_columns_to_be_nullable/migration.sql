-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "views" DROP NOT NULL,
ALTER COLUMN "available_quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL;