## ADDED Requirements

### Requirement: Payload CMS 3 embedded in the Next.js application
The system SHALL integrate Payload CMS 3 as an embedded TypeScript library within the Next.js 14 App Router project, sharing the same deployment on Vercel and the same PostgreSQL Supabase database.

#### Scenario: Admin panel accessible at /admin
- **WHEN** a browser navigates to `/admin`
- **THEN** the Payload CMS admin panel is rendered and functional

#### Scenario: Payload uses same PostgreSQL database as Prisma
- **WHEN** the Payload config is inspected
- **THEN** `DATABASE_URL` points to the same Supabase PostgreSQL instance used by Prisma

### Requirement: Opportunity collection defined in Payload CMS
The system SHALL define an `Opportunity` collection in Payload CMS with all fields specified in PRD section 9.2: `title`, `country`, `category`, `study_level`, `domain`, `funding_type`, `budget_required`, `deadline`, `competitiveness_level`, `eligibility_summary`, `source_url`, `short_description`, `is_active`, `created_at`, `updated_at`.

#### Scenario: Admin can create an opportunity without code changes
- **WHEN** an authenticated admin user fills the Opportunity creation form in `/admin`
- **THEN** a new opportunity record is saved to the database

#### Scenario: Opportunity can be deactivated immediately
- **WHEN** an admin sets `is_active` to false on an opportunity
- **THEN** the opportunity is immediately excluded from matching results

### Requirement: AdminUser collection with RBAC defined in Payload CMS
The system SHALL define an `AdminUser` collection in Payload CMS with role-based access control. Admin accounts are completely separate from Supabase Auth user accounts.

#### Scenario: AdminUser can log in to /admin
- **WHEN** a valid AdminUser submits credentials on the Payload login page
- **THEN** a Payload JWT session is created and the admin panel is accessible

#### Scenario: Regular Supabase user cannot access /admin
- **WHEN** a request with a valid Supabase JWT (but no Payload JWT) is sent to `/admin/**`
- **THEN** the request is redirected to the Payload login page

### Requirement: payload.config.ts defines collections and database adapter
The system SHALL have a `payload.config.ts` at the project root that configures the PostgreSQL adapter (Drizzle), the `Opportunity` and `AdminUser` collections, and the `PAYLOAD_SECRET` for session signing.

#### Scenario: Payload config loads without errors
- **WHEN** `npx payload migrate:create` or `npx payload generate:types` is run
- **THEN** the command completes without configuration errors

### Requirement: Payload migrations run separately from Prisma migrations
The system SHALL manage Payload CMS schema migrations via `npx payload migrate` independently from Prisma migrations, operating on separate table namespaces within the same PostgreSQL database.

#### Scenario: Payload migration creates CMS tables
- **WHEN** `npx payload migrate` is run on a fresh database
- **THEN** `opportunities`, `admin_users`, `payload_preferences`, and `payload_migrations` tables are created
