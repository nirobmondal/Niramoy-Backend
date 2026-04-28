/*
  Warnings:

  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `medicines` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `seller_orders` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `sellers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderItemId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unitPrice` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `manufacturers` table without a default value. This is not possible if the table is not empty.
  - Made the column `strength` on table `medicines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dosageForm` on table `medicines` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `subtotal` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderItemId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `seller_orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD');

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_sellerOrderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "seller_orders" DROP CONSTRAINT "seller_orders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "seller_orders" DROP CONSTRAINT "seller_orders_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "sellers" DROP CONSTRAINT "sellers_userId_fkey";

-- DropIndex
DROP INDEX "account_providerId_accountId_key";

-- DropIndex
DROP INDEX "cart_item_cart_id_idx";

-- DropIndex
DROP INDEX "cart_user_id_idx";

-- DropIndex
DROP INDEX "category_name_idx";

-- DropIndex
DROP INDEX "medicine_is_available_idx";

-- DropIndex
DROP INDEX "order_item_seller_order_id_idx";

-- DropIndex
DROP INDEX "order_user_id_idx";

-- DropIndex
DROP INDEX "review_user_id_idx";

-- DropIndex
DROP INDEX "reviews_userId_medicineId_key";

-- DropIndex
DROP INDEX "user_created_at_idx";

-- DropIndex
DROP INDEX "user_is_banned_idx";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "icon",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "manufacturers" DROP COLUMN "icon",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "avgRating" DECIMAL(3,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "strength" SET NOT NULL,
ALTER COLUMN "dosageForm" SET NOT NULL,
ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price",
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "notes",
DROP COLUMN "phone",
DROP COLUMN "userId",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
ADD COLUMN     "shippingName" TEXT NOT NULL,
ADD COLUMN     "shippingPhone" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PLACED';

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "userId",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "orderItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "seller_orders" DROP COLUMN "totalAmount",
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "address",
DROP COLUMN "isBanned",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "sellers";

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "shopAddress" TEXT,
    "shopPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_userId_key" ON "seller_profiles"("userId");

-- CreateIndex
CREATE INDEX "seller_profiles_shopName_idx" ON "seller_profiles"("shopName");

-- CreateIndex
CREATE INDEX "medicines_sellerId_idx" ON "medicines"("sellerId");

-- CreateIndex
CREATE INDEX "medicines_isAvailable_isFeatured_idx" ON "medicines"("isAvailable", "isFeatured");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- Deduplicate reviews by orderItemId before enforcing uniqueness.
-- Keep the most recently updated row per orderItemId and delete older duplicates.
WITH ranked_reviews AS (
  SELECT
    "id",
    "orderItemId",
    ROW_NUMBER() OVER (
      PARTITION BY "orderItemId"
      ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC
    ) AS rn
  FROM "reviews"
  WHERE "orderItemId" IS NOT NULL
)
DELETE FROM "reviews"
WHERE "id" IN (
  SELECT "id" FROM ranked_reviews WHERE rn > 1
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_orderItemId_key" ON "reviews"("orderItemId");

-- CreateIndex
CREATE INDEX "reviews_customerId_idx" ON "reviews"("customerId");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sellerOrderId_fkey" FOREIGN KEY ("sellerOrderId") REFERENCES "seller_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_orders" ADD CONSTRAINT "seller_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_orders" ADD CONSTRAINT "seller_orders_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "cart_item_medicine_id_idx" RENAME TO "cart_items_medicineId_idx";

-- RenameIndex
ALTER INDEX "manufacturer_name_idx" RENAME TO "manufacturers_name_idx";

-- RenameIndex
ALTER INDEX "medicine_category_id_idx" RENAME TO "medicines_categoryId_idx";

-- RenameIndex
ALTER INDEX "medicine_manufacturer_id_idx" RENAME TO "medicines_manufacturerId_idx";

-- RenameIndex
ALTER INDEX "medicine_name_idx" RENAME TO "medicines_name_idx";

-- RenameIndex
ALTER INDEX "order_item_medicine_id_idx" RENAME TO "order_items_medicineId_idx";

-- RenameIndex
ALTER INDEX "order_created_at_idx" RENAME TO "orders_createdAt_idx";

-- RenameIndex
ALTER INDEX "order_status_idx" RENAME TO "orders_status_idx";

-- RenameIndex
ALTER INDEX "review_medicine_id_idx" RENAME TO "reviews_medicineId_idx";

-- RenameIndex
ALTER INDEX "seller_order_order_id_idx" RENAME TO "seller_orders_orderId_idx";

-- RenameIndex
ALTER INDEX "seller_order_seller_id_idx" RENAME TO "seller_orders_sellerId_idx";
