CREATE TYPE "CoachingBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

CREATE TABLE "CoachingBooking" (
  "id"         TEXT NOT NULL,
  "date"       TEXT NOT NULL,
  "slot"       TEXT NOT NULL,
  "email"      TEXT,
  "status"     "CoachingBookingStatus" NOT NULL DEFAULT 'PENDING',
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CoachingBooking_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CoachingBooking_date_slot_key" ON "CoachingBooking"("date", "slot");
