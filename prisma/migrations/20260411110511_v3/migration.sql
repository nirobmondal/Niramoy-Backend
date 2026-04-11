/*
  Warnings:

  - You are about to drop the column `status` on the `seller_orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "seller_order_status_idx";

-- AlterTable
ALTER TABLE "seller_orders" DROP COLUMN "status";
