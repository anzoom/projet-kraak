## ADDED Requirements

### Requirement: Project initialized with Next.js 14 App Router and TypeScript
The system SHALL be a Next.js 14 application using the App Router with TypeScript strict mode enabled and the directory structure defined in ARCHITECTURE.md section 5.

#### Scenario: Project compiles without errors
- **WHEN** `tsc --noEmit` is run on the project
- **THEN** zero TypeScript errors are reported

#### Scenario: Dev server starts successfully
- **WHEN** `npm run dev` is executed
- **THEN** the server is available at `http://localhost:3000` and renders without runtime errors

### Requirement: Tailwind CSS and shadcn/ui configured
The system SHALL use Tailwind CSS v3 with a mobile-first configuration and shadcn/ui for accessible UI components.

#### Scenario: Tailwind classes render correctly
- **WHEN** a component uses Tailwind utility classes
- **THEN** the styles are applied correctly in the browser

#### Scenario: shadcn/ui component renders
- **WHEN** a shadcn/ui component (e.g., Button) is imported and rendered
- **THEN** it renders with correct styles and accessibility attributes

### Requirement: Project directory structure matches architecture specification
The system SHALL have the directory structure defined in ARCHITECTURE.md section 5, including `src/app/(public)`, `src/app/(protected)`, `src/app/(payload)`, `src/domain/`, `src/collections/`, `src/lib/`, and `src/components/`.

#### Scenario: Required directories exist
- **WHEN** the project is initialized
- **THEN** all directories from ARCHITECTURE.md section 5 are present

### Requirement: Environment variables configured per environment
The system SHALL load environment variables from `.env.local` (development) and from Vercel environment variables (staging/production), with no secrets committed to git.

#### Scenario: Missing required env var fails at startup
- **WHEN** a required environment variable is missing
- **THEN** the application fails fast with an explicit error message naming the missing variable

#### Scenario: .env.local is gitignored
- **WHEN** `.gitignore` is inspected
- **THEN** `.env.local` is listed and not tracked by git
