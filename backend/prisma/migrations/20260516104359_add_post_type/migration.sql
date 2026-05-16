-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('BLOG', 'ACTIVITY');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'BLOG';
