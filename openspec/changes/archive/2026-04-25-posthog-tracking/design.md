## Architecture

PostHog est intégré via `posthog-js` (SDK client officiel). L'initialisation se fait dans un Client Component `PostHogProvider` qui wrap le layout app, ce qui permet à tous les composants enfants (Server et Client) d'utiliser `posthog.capture()` depuis les Client Components.

La clé `NEXT_PUBLIC_POSTHOG_KEY` est publique (préfixe `NEXT_PUBLIC_`) — exposée au bundle client intentionnellement, c'est le modèle standard PostHog.

## PostHogProvider

```tsx
// src/components/PostHogProvider.tsx
"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

## Layout wrapping

```tsx
// src/app/(app)/layout.tsx
import { PostHogProvider } from "@/components/PostHogProvider"

export default function AppLayout({ children }) {
  return (
    <html>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
```

## Événements et propriétés

| Événement | Déclencheur | Propriétés |
|---|---|---|
| `test_started` | Premier step affiché dans TestStepper | — |
| `test_completed` | Step 10 soumis (answers complet) | `answers_count: number` |
| `results_viewed` | ResultsClient monte avec des recommandations | `recommendations_count`, `segment`, `top_score` |
| `opportunity_clicked` | Clic "Voir les détails" dans RecommendationCard | `opportunity_id`, `opportunity_title`, `badge` |
| `opportunity_source_clicked` | Clic "Postuler →" (lien externe) | `opportunity_id`, `opportunity_title`, `source_url` |
| `coaching_cta_clicked` | Clic sur CTA CoachingUpsell | `cta_label` |

## Capture dans les composants

Les composants appellent directement `posthog.capture()` depuis `posthog-js` (pas de hook `usePostHog` pour éviter un re-render inutile).

```ts
import posthog from "posthog-js"
posthog.capture("opportunity_clicked", { opportunity_id: rec.opportunity.id, ... })
```

## Garde-fous

- `posthog.init` ne s'exécute qu'une fois (useEffect avec `[]`)
- `capture_pageview: true` couvre les vues landing automatiquement
- Si `NEXT_PUBLIC_POSTHOG_KEY` est vide (env local sans clé), PostHog ne s'initialise pas et les `capture()` sont des no-ops silencieux — pas d'erreur
