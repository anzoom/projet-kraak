-- Extend WaitlistEntry for beta validation phase
ALTER TABLE "WaitlistEntry"
  ADD COLUMN "first_name"       TEXT,
  ADD COLUMN "country"          TEXT,
  ADD COLUMN "education_level"  TEXT,
  ADD COLUMN "domain"           TEXT,
  ADD COLUMN "opportunity_type" TEXT,
  ADD COLUMN "interest"         TEXT,
  ADD COLUMN "pain_point"       TEXT,
  ADD COLUMN "status"           TEXT NOT NULL DEFAULT 'pending';

-- Update default source for new signups
ALTER TABLE "WaitlistEntry" ALTER COLUMN "source" SET DEFAULT 'landing';
