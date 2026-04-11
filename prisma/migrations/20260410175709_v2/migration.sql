/*
  Warnings:

  - You are about to drop the column `orderId` on the `order_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sellerOrderId,medicineId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sellerOrderId` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropIndex
DROP INDEX "order_item_order_id_idx";

-- DropIndex
DROP INDEX "order_items_orderId_medicineId_key";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "orderId",
ADD COLUMN     "sellerOrderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "order_item_seller_order_id_idx" ON "order_items"("sellerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_sellerOrderId_medicineId_key" ON "order_items"("sellerOrderId", "medicineId");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sellerOrderId_fkey" FOREIGN KEY ("sellerOrderId") REFERENCES "seller_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
