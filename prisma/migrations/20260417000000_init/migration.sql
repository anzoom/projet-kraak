-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "supabase_uid" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResponse" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileScore" (
    "id" TEXT NOT NULL,
    "test_response_id" TEXT NOT NULL,
    "academic_score" INTEGER NOT NULL,
    "financial_score" INTEGER NOT NULL,
    "maturity_score" INTEGER NOT NULL,
    "segment" TEXT NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "score_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "match_score" DOUBLE PRECISION NOT NULL,
    "justification" TEXT NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "psp" TEXT NOT NULL,
    "psp_transaction_id" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseAccess" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "score_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabase_uid_key" ON "User"("supabase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileScore_test_response_id_key" ON "UserProfileScore"("test_response_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_psp_transaction_id_key" ON "Payment"("psp_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseAccess_payment_id_key" ON "PurchaseAccess"("payment_id");

-- AddForeignKey
ALTER TABLE "TestResponse" ADD CONSTRAINT "TestResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileScore" ADD CONSTRAINT "UserProfileScore_test_response_id_fkey" FOREIGN KEY ("test_response_id") REFERENCES "TestResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "UserProfileScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseAccess" ADD CONSTRAINT "PurchaseAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseAccess" ADD CONSTRAINT "PurchaseAccess_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseAccess" ADD CONSTRAINT "PurchaseAccess_score_id_fkey" FOREIGN KEY ("score_id") REFERENCES "UserProfileScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

