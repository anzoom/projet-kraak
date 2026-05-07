## ADDED Requirements

### Requirement: Prisma schema defines all business entities
The system SHALL have a `prisma/schema.prisma` file declaring the following models exactly as specified in ARCHITECTURE.md section 4: `User`, `TestResponse`, `UserProfileScore`, `Recommendation`, `Payment`, `PurchaseAccess`, and the `PaymentStatus` enum.

#### Scenario: Prisma schema validates without errors
- **WHEN** `npx prisma validate` is run
- **THEN** it exits with code 0 and reports no errors

#### Scenario: Payment amounts stored as integers
- **WHEN** the `Payment` model is inspected
- **THEN** the `amount` field is typed `Int` (not `Float`) to prevent floating-point rounding on XOF amounts

### Requirement: Prisma client singleton available in src/lib/prisma/
The system SHALL expose a Prisma client singleton at `src/lib/prisma/index.ts` that prevents multiple client instances in development (hot-reload safe).

#### Scenario: Single Prisma client instance in development
- **WHEN** the app hot-reloads in development
- **THEN** only one Prisma client instance is active (stored on `globalThis`)

### Requirement: Initial Prisma migration generated and applied
The system SHALL have an initial migration created via `prisma migrate dev --name init` that creates all business tables in the dev Supabase PostgreSQL database.

#### Scenario: Migration applied successfully on dev database
- **WHEN** `npx prisma migrate dev` is run against the dev Supabase database
- **THEN** all 6 business tables are created and `prisma migrate status` shows no pending migrations

#### Scenario: Migration deployed on staging/production
- **WHEN** `npx prisma migrate deploy` is run in CI/CD
- **THEN** all migrations are applied without errors

### Requirement: Prisma and Payload CMS migrations run in correct order
The system SHALL enforce migration execution order: Payload migrations MUST run before Prisma migrations to avoid PostgreSQL lock conflicts.

#### Scenario: CI/CD pipeline runs Payload migrate before Prisma migrate
- **WHEN** the production deployment pipeline executes
- **THEN** `npx payload migrate` completes before `npx prisma migrate deploy` starts

### Requirement: User soft delete supported via deleted_at field
The system SHALL implement GDPR-compliant soft delete on the `User` model using a nullable `deleted_at` field. A null value indicates an active user.

#### Scenario: Soft-deleted user excluded from active queries
- **WHEN** a query fetches active users
- **THEN** users with a non-null `deleted_at` are excluded from results

#### Scenario: Referential integrity preserved after soft delete
- **WHEN** a user's `deleted_at` is set
- **THEN** related records (TestResponse, Payment, PurchaseAccess) remain intact in the database
