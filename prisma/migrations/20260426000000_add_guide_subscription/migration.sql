-- CreateEnum
CREATE TYPE "GuidePlan" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "GuideSubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "GuideSubscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" "GuidePlan" NOT NULL,
    "status" "GuideSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "lemon_order_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuideSubscription_user_id_idx" ON "GuideSubscription"("user_id");

-- AddForeignKey
ALTER TABLE "GuideSubscription" ADD CONSTRAINT "GuideSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
