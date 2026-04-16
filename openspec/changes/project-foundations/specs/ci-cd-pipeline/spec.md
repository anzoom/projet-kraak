## ADDED Requirements

### Requirement: GitHub Actions pipeline runs on every pull request
The system SHALL have a GitHub Actions workflow that runs on every pull request targeting `main` or `staging`, executing: ESLint, TypeScript typecheck (`tsc --noEmit`), Vitest unit tests, Next.js build, and Vercel preview deployment.

#### Scenario: PR pipeline blocks merge on typecheck failure
- **WHEN** a pull request contains TypeScript errors
- **THEN** the GitHub Actions check fails and the PR cannot be merged until errors are resolved

#### Scenario: PR pipeline deploys a Vercel preview
- **WHEN** a pull request passes all checks
- **THEN** a Vercel preview deployment URL is available on the PR

### Requirement: Production deployment pipeline runs on merge to main
The system SHALL have a GitHub Actions workflow that runs on merge to `main`, executing the full check suite followed by Payload migrations then Prisma migrations then Vercel production deployment, in that exact order.

#### Scenario: Payload migrate runs before Prisma migrate in production deploy
- **WHEN** the production deployment pipeline executes
- **THEN** the pipeline step `npx payload migrate` completes successfully before `npx prisma migrate deploy` starts

#### Scenario: Failed migration halts deployment
- **WHEN** a migration step exits with a non-zero code
- **THEN** the pipeline stops immediately and the Vercel production deployment does not proceed

### Requirement: Three Vercel environments mapped to git branches
The system SHALL configure Vercel with three environments: development (local), staging (auto-deployed from `staging` branch), and production (auto-deployed from `main` branch). Each environment uses its own Supabase project and environment variables.

#### Scenario: Push to staging branch triggers staging deployment
- **WHEN** code is merged into the `staging` branch
- **THEN** Vercel automatically deploys to the staging environment with staging Supabase variables

#### Scenario: Staging uses CinetPay sandbox credentials
- **WHEN** the staging environment is deployed
- **THEN** it uses `CINETPAY_API_KEY` and `CINETPAY_SITE_ID` from the CinetPay sandbox, not production credentials

### Requirement: No secrets stored in the git repository
The system SHALL ensure all secrets (API keys, database URLs, Payload secret, etc.) are stored exclusively in Vercel environment variables and GitHub Actions secrets, never committed to the repository.

#### Scenario: .env.local is not tracked by git
- **WHEN** `git status` is run on a fresh clone with a local `.env.local`
- **THEN** `.env.local` appears as untracked and is not staged

#### Scenario: .env.example documents all required variables
- **WHEN** `.env.example` is inspected
- **THEN** all environment variables listed in ARCHITECTURE.md section 6 are present with placeholder values
