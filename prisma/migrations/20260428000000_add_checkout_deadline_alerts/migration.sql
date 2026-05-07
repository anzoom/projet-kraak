-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "DeadlineAlertPreference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "alert_90d" BOOLEAN NOT NULL DEFAULT true,
    "alert_30d" BOOLEAN NOT NULL DEFAULT true,
    "alert_7d" BOOLEAN NOT NULL DEFAULT true,
    "saved_opp_id" TEXT NOT NULL,

    CONSTRAINT "DeadlineAlertPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentDeadlineAlert" (
    "id" TEXT NOT NULL,
    "pref_id" TEXT NOT NULL,
    "days_before" INTEGER NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentDeadlineAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" "GuidePlan" NOT NULL,
    "token" TEXT NOT NULL,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeadlineAlertPreference_saved_opp_id_key" ON "DeadlineAlertPreference"("saved_opp_id");

-- CreateIndex
CREATE INDEX "DeadlineAlertPreference_user_id_idx" ON "DeadlineAlertPreference"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeadlineAlertPreference_user_id_opportunity_id_key" ON "DeadlineAlertPreference"("user_id", "opportunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "SentDeadlineAlert_pref_id_days_before_key" ON "SentDeadlineAlert"("pref_id", "days_before");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_token_key" ON "CheckoutSession"("token");

-- CreateIndex
CREATE INDEX "CheckoutSession_user_id_idx" ON "CheckoutSession"("user_id");

-- CreateIndex
CREATE INDEX "CheckoutSession_token_idx" ON "CheckoutSession"("token");

-- AddForeignKey
ALTER TABLE "DeadlineAlertPreference" ADD CONSTRAINT "DeadlineAlertPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeadlineAlertPreference" ADD CONSTRAINT "DeadlineAlertPreference_saved_opp_id_fkey" FOREIGN KEY ("saved_opp_id") REFERENCES "SavedOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentDeadlineAlert" ADD CONSTRAINT "SentDeadlineAlert_pref_id_fkey" FOREIGN KEY ("pref_id") REFERENCES "DeadlineAlertPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutSession" ADD CONSTRAINT "CheckoutSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
