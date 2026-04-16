## ADDED Requirements

### Requirement: Next.js middleware separates Supabase and Payload authentication
The system SHALL implement a `src/middleware.ts` that routes authentication verification based on the request path: Payload manages `/admin/**` routes entirely, and the Next.js middleware handles all other protected routes by verifying the Supabase JWT.

#### Scenario: /admin routes pass through without Supabase JWT check
- **WHEN** a request targets a path starting with `/admin`
- **THEN** `middleware.ts` calls `NextResponse.next()` without verifying the Supabase JWT, delegating auth entirely to Payload

#### Scenario: Protected user routes redirect unauthenticated requests
- **WHEN** a request targets `/dashboard` or `/results` without a valid Supabase JWT cookie
- **THEN** the middleware redirects the request to `/auth/login`

#### Scenario: Protected user routes allow authenticated requests
- **WHEN** a request targets `/dashboard` or `/results` with a valid Supabase JWT cookie
- **THEN** the middleware allows the request to proceed to the route handler

### Requirement: score_id transmitted via HttpOnly session cookie
The system SHALL store the `score_id` in an HttpOnly session cookie after scoring, so it can be securely read server-side on the `/results/[scoreId]` route without being accessible from JavaScript.

#### Scenario: score_id cookie set after scoring
- **WHEN** the scoring API creates a `UserProfileScore`
- **THEN** an HttpOnly cookie containing the `score_id` is set on the response

#### Scenario: score_id not accessible via JavaScript
- **WHEN** browser JavaScript attempts to read the score_id cookie
- **THEN** the cookie value is not accessible (HttpOnly flag enforced)

### Requirement: Route access control enforced server-side for /results/[scoreId]
The system SHALL verify `PurchaseAccess` server-side on every request to `/results/[scoreId]`. The `user_id` MUST be extracted from the Supabase JWT, never from the request body or query parameters.

#### Scenario: Valid PurchaseAccess grants full results access
- **WHEN** an authenticated user requests `/results/[scoreId]` and has a non-expired `PurchaseAccess` record matching their `user_id` and `score_id`
- **THEN** the full results page is rendered

#### Scenario: Missing or expired PurchaseAccess redirects to paywall
- **WHEN** an authenticated user requests `/results/[scoreId]` but has no valid `PurchaseAccess` record
- **THEN** the user is redirected to `/results`

#### Scenario: user_id from JWT, not request body
- **WHEN** a request to `/results/[scoreId]` includes a different `user_id` in query parameters
- **THEN** the server ignores the query parameter and uses exclusively the `user_id` from the Supabase JWT

### Requirement: Rate limiting applied to auth and payment endpoints
The system SHALL apply rate limiting via Upstash Redis on `/auth/**` and `/api/payment/**` endpoints to protect against brute force attacks.

#### Scenario: Excessive login attempts blocked
- **WHEN** more than the configured threshold of login attempts occur from the same IP within the rate-limiting window
- **THEN** subsequent requests return HTTP 429 Too Many Requests

#### Scenario: Rate limiting does not affect normal usage
- **WHEN** a user makes a normal number of requests to auth endpoints
- **THEN** all requests proceed without rate-limiting errors
