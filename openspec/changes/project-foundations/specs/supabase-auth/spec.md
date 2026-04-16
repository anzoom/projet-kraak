## ADDED Requirements

### Requirement: Supabase client initialized for server and browser contexts
The system SHALL provide two distinct Supabase clients: a server-side client (using `SUPABASE_SERVICE_ROLE_KEY`) and a browser-side client (using `NEXT_PUBLIC_SUPABASE_ANON_KEY`), located in `src/lib/supabase/`.

#### Scenario: Server client never exposed to browser bundle
- **WHEN** the Next.js bundle is analyzed
- **THEN** `SUPABASE_SERVICE_ROLE_KEY` does not appear in any client-side bundle

#### Scenario: Browser client initializes with public keys only
- **WHEN** the browser Supabase client is instantiated
- **THEN** it uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Requirement: User registration via Supabase Auth
The system SHALL allow users to register with email and password via Supabase Auth. A corresponding `User` record SHALL be created in the Prisma `users` table upon successful registration.

#### Scenario: Successful registration creates Supabase account and Prisma user
- **WHEN** a user submits valid email and password on the registration form
- **THEN** a Supabase Auth account is created, a `User` row is inserted in PostgreSQL with the `supabase_uid`, and a JWT HttpOnly cookie is set

#### Scenario: Duplicate email rejected
- **WHEN** a user attempts to register with an email already in Supabase Auth
- **THEN** the form displays an error message and no duplicate record is created

### Requirement: User login and session management via JWT HttpOnly cookie
The system SHALL authenticate users via email/password and persist the session in a JWT HttpOnly cookie inaccessible from JavaScript.

#### Scenario: Successful login sets HttpOnly cookie
- **WHEN** a user submits valid credentials
- **THEN** a JWT HttpOnly cookie is set and the user is redirected to `/dashboard`

#### Scenario: Expired or invalid cookie redirects to login
- **WHEN** a request arrives with an expired or invalid JWT cookie
- **THEN** the user is redirected to `/auth/login`

### Requirement: Password reset flow
The system SHALL provide a password reset flow via Supabase Auth email link.

#### Scenario: Reset email sent for known address
- **WHEN** a user submits their email on the reset page
- **THEN** Supabase Auth sends a reset email and the UI shows a confirmation message

#### Scenario: Unknown email does not reveal existence
- **WHEN** a user submits an email not registered in Supabase Auth
- **THEN** the UI shows the same confirmation message without revealing whether the email exists

### Requirement: Three isolated Supabase projects for dev/staging/production
The system SHALL use three separate Supabase projects (dev, staging, prod), each with its own PostgreSQL database and Auth configuration. No database is shared between environments.

#### Scenario: Dev environment uses dev Supabase project
- **WHEN** the app runs with `NODE_ENV=development`
- **THEN** it connects to the dev Supabase project URL

#### Scenario: Production environment uses prod Supabase project
- **WHEN** the app runs in production on Vercel
- **THEN** it connects to the prod Supabase project URL
