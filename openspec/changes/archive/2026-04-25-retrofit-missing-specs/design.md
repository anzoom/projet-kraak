## Architecture

### Nouvelle spec — `coaching`

**Fichier :** `openspec/specs/coaching/spec.md`

**Périmètre :** page `/coaching`, tunnel de réservation, upsell dans les résultats, APIs booking.

```
/coaching
  ├── Liste des offres (OFFERS : audit 15k FCFA, accompagnement 50k FCFA)
  ├── Sélection offre → BookingCalendar
  │     ├── Calendrier 12 jours glissants (hors dimanche)
  │     ├── Créneaux 45 min de 11h à 16h
  │     ├── Créneaux indisponibles depuis GET /api/coaching/slots
  │     └── Confirmation → POST /api/coaching/book → redirect WhatsApp
  └── Upsell dans ResultsClient via CoachingUpsell.tsx

APIs :
  GET  /api/coaching/slots     → liste des réservations PENDING/CONFIRMED (publiques)
  POST /api/coaching/book      → créer une réservation (idempotence sur date+slot → 409)
  GET  /api/coaching/[id]      → détail d'une réservation
```

Événements PostHog : `coaching_offer_selected`, `coaching_slot_booked`.

---

### Nouvelle spec — `opportunity-save`

**Fichier :** `openspec/specs/opportunity-save/spec.md`

**Périmètre :** sauvegarde locale des opportunités favorites.

```
useSavedOpportunities (hook Zustand + persist localStorage)
  ├── key : "kraak_saved_opportunities"
  ├── savedIds: string[]   → liste des IDs sauvegardés
  ├── toggle(id)           → ajoute ou retire un ID
  └── isSaved(id) / count

SaveButton.tsx (Client Component)
  └── Bouton cœur sur chaque RecommendationCard
      → appelle toggle(opportunityId)
      → état visuel : sauvegardé (plein) / non sauvegardé (contour)
```

Contrainte : aucune persistance serveur — localStorage uniquement. Aucune auth requise.

---

### Nouvelle spec — `user-dashboard`

**Fichier :** `openspec/specs/user-dashboard/spec.md`

**Périmètre :** page protégée `/dashboard`, affichage du profil utilisateur.

```
/dashboard (Server Component — route protégée)
  ├── Vérification session Supabase → redirect /auth/login si absent
  └── ProfileClient (email utilisateur)
        ├── Affichage email
        ├── Toggle alertes email (alerts_enabled via PATCH /api/user/alerts)
        └── Bouton déconnexion → /auth/logout
```

Middleware `src/proxy.ts` protège `/dashboard` → redirect `/auth/login` si JWT absent.

---

### Nouvelle spec — `opportunity-alerts`

**Fichier :** `openspec/specs/opportunity-alerts/spec.md`

**Périmètre :** préférences d'alertes + cron hebdomadaire.

```
GET  /api/user/alerts   → { alerts_enabled: boolean }
POST /api/user/alerts   → toggle alerts_enabled (user_id extrait du JWT)

GET  /api/cron/send-alerts  (protégée par Bearer CRON_SECRET)
  ├── Récupère tous les users avec alerts_enabled = true et un test_response
  ├── Recalcule les recommandations (matchOpportunities)
  ├── Envoie un email Resend (max 3 oppos, template HTML)
  └── Retourne { sent, skipped }
```

Déclenchement : Vercel Cron (vercel.json) — fréquence hebdomadaire.

---

### Nouvelle spec — `posthog-tracking`

**Fichier :** `openspec/specs/posthog-tracking/spec.md`

**Périmètre :** initialisation PostHog et catalogue complet des événements.

```
PostHogProvider.tsx (Client Component)
  └── posthog.init(NEXT_PUBLIC_POSTHOG_KEY, { api_host: NEXT_PUBLIC_POSTHOG_HOST })
  └── Wrappé dans (app)/layout.tsx

Événements capturés :
  test_started         → TestStepper (premier step)
  test_completed       → TestStepper (soumission dernier step)
  results_viewed       → ResultsClient (après calcul)
  opportunity_clicked  → RecommendationCard (clic "Voir les détails")
  opportunity_source_clicked → RecommendationCard (clic "Postuler →")
  coaching_cta_clicked → CoachingUpsell (chaque CTA)
  coaching_offer_selected → CoachingPage (sélection offre)
  coaching_slot_booked    → CoachingPage (réservation confirmée)
```

Variables d'env : `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.

---

### Nouvelle spec — `expired-opportunities`

**Fichier :** `openspec/specs/expired-opportunities/spec.md`

**Périmètre :** règles de visibilité et UX des opportunités dont la deadline est dépassée.

```
Règle de visibilité (matcher.ts) :
  showExpired = timeline ∈ { "moyen", "long" }
  Si showExpired = false → opportunités expirées exclues du résultat

Tri :
  active[]  → triées par score décroissant → badges top/probability
  expired[] → triées par score décroissant → pas de badge
  résultat  = [...active, ...expired]

RecommendationCard (isExpired = true) :
  ├── Badge "📅 Candidature fermée — surveille la prochaine édition"
  ├── Deadline affichée barrée avec préfixe "Éd."
  ├── Opacité réduite (opacity-80), bordure grise

OpportunityDetailModal (isExpired = true) :
  ├── Bannière ambre "Édition passée — candidatures fermées"
  ├── Deadline badge barrée avec préfixe "Éd."
  ├── Étape 4 remplacée : "Surveillez l'ouverture des candidatures pour la prochaine édition"
  └── CTA grisé "Voir le programme officiel" (au lieu de "Postuler sur le site officiel")
```

---

### Mise à jour — `free-results-access`

**Fichier :** `openspec/specs/free-results-access/spec.md` (remplace `results-paywall`)

**Périmètre :** accès libre aux résultats après pivot freemium → gratuit.

```
Avant (abandonné) : paywall après N résultats → paiement CinetPay → accès complet
Maintenant : 
  ├── Tous les résultats affichés sans restriction
  ├── Coaching upsell (CoachingUpsell.tsx) affiché après les résultats
  └── Résultats limités à 5 recommandations actives maximum (+ expirées si eligible)
```

Note : `results-paywall/spec.md` est conservée pour historique — elle documente un modèle abandonné.

---

### Synchronisation — `project-foundations`

Les specs suivantes sont présentes dans `openspec/changes/project-foundations/specs/` et doivent être copiées vers `openspec/specs/` :
- `auth-middleware` → protection des routes, proxy.ts
- `nextjs-app-setup` → App Router, layouts, routes groups
- `payload-cms-admin` → Payload CMS, collections, admin
- `prisma-schema` → schéma Prisma, migrations
- `supabase-auth` → configuration Supabase Auth
- `ci-cd-pipeline` → Vercel CI/CD, variables d'env
