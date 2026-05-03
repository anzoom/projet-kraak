## Context

La page `/guide-premium` est le point d'atterrissage pour les utilisateurs non-abonnés cliquant sur le CTA de l'UpsellGuide. C'est une page marketing + conversion : présenter le produit, convaincre, et capturer les emails en liste d'attente avant que le paiement soit disponible.

Stack existante : Next.js 14 App Router, Prisma (PostgreSQL via Supabase), Resend (emails transactionnels déjà intégré), Tailwind CSS.

## Goals / Non-Goals

**Goals:**
- Page de présentation complète du Guide Premium (valeur, bénéfices, tarifs)
- Formulaire de liste d'attente : email → stockage `WaitlistEntry` en DB
- Feedback utilisateur immédiat après inscription (succès/erreur)
- Accessible sans authentification (page publique)
- Email de confirmation optionnel via Resend

**Non-Goals:**
- Intégration paiement (Phase 2 — Lemon Squeezy)
- Espace membre Guide Premium (Phase 2)
- A/B testing ou variants marketing

## Decisions

### Décision 1 : Stockage des emails en DB (WaitlistEntry) vs. simple email

**Choix :** Stocker dans Prisma `WaitlistEntry` + envoyer un email de confirmation via Resend.

**Rationale :** La liste d'attente est un actif commercial. La stocker en DB permet de la requêter, d'exporter, et d'éviter les doublons. Resend envoie la confirmation sans bloquer la réponse (fire-and-forget côté serveur).

**Alternative écartée :** Envoyer uniquement un email à l'équipe → perd l'idempotence et empêche la gestion des doublons.

### Décision 2 : Server Action vs. API Route pour le formulaire

**Choix :** API Route `POST /api/guide-premium/waitlist` (JSON body).

**Rationale :** Cohérent avec le reste du projet (toutes les mutations passent par des API routes). Permet un usage futur depuis d'autres surfaces (ex. landing page externe).

**Alternative écartée :** Server Action → moins testable, couplage fort avec le composant.

### Décision 3 : Page publique dans `(public)` vs. `(protected)`

**Choix :** `(public)` — accessible sans authentification.

**Rationale :** La page doit convertir des visiteurs non connectés. L'authentification est optionnelle (le lien vient de `/catalog` qui est protégé, mais la page elle-même doit être shareable).

### Décision 4 : Modèle WaitlistEntry minimal

```prisma
model WaitlistEntry {
  id         String   @id @default(cuid())
  email      String   @unique
  source     String   @default("guide-premium")
  created_at DateTime @default(now())
}
```

`email @unique` pour éviter les doublons. `source` pour tracer l'origine si on ajoute d'autres listes d'attente.

## Risks / Trade-offs

- **[Risque] Doublons email** → Mitigation : `email @unique` en DB + gestion du code Prisma `P2002` (UniqueConstraintViolation) → retourner 200 avec message "déjà inscrit"
- **[Risque] Resend indisponible** → Mitigation : fire-and-forget, l'inscription en DB reste valide même si l'email échoue
- **[Trade-off] Page statique vs. dynamique** → La page est un Server Component sans données utilisateur → peut être rendu statiquement (revalidate: false), très rapide

## Open Questions

- Quel email d'expéditeur pour la confirmation ? (`hello@kraak.co` ou `noreply@kraak.co`)
- Ajouter un lien vers la page guide-premium depuis la landing page (`/`) ?
