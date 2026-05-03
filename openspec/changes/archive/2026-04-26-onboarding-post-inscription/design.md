## Context

Deux flux d'inscription coexistent :
1. **Session immédiate** (confirmation email désactivée en dev) : `signUp` retourne une session directement. `RegisterForm` redirige vers `/results` ou `/`.
2. **Session différée** (confirmation email activée en prod) : `signUp` envoie un email, l'utilisateur clique le lien, le callback `/auth/callback` échange le code et redirige.

L'email de bienvenue doit être envoyé dans les deux cas. Le guidage vers le test concerne uniquement les inscriptions hors `?from=test`.

## Goals / Non-Goals

**Goals:**
- Envoyer un email de bienvenue unique par utilisateur après confirmation du compte
- Guider les nouveaux utilisateurs sans test de profil vers `/test?welcome=1`
- Éviter les doublons d'envoi via un flag `welcome_sent` en DB
- Afficher un bandeau de bienvenue sur `/test` si `?welcome=1` est présent

**Non-Goals:**
- Séquence d'emails d'onboarding multi-étapes (Phase 2)
- Tracking d'ouverture des emails
- Onboarding guidé in-app (tutoriel, tooltips)

## Decisions

### Décision 1 : Trigger via API Route `/api/user/welcome` (POST)

**Choix :** Créer une API route dédiée appelée depuis `RegisterForm` (session immédiate) et depuis `/auth/callback` (session différée).

**Rationale :** Centralise la logique de bienvenue en un seul endroit. L'idempotence est garantie par `welcome_sent` en DB : même si l'API est appelée deux fois (bug réseau, retry), l'email n'est envoyé qu'une fois.

**Alternative écartée :** Supabase webhook `user.created` — nécessite une URL publique et une configuration dashboard, non testable en local.

**Alternative écartée :** Appel direct Resend depuis `RegisterForm` — expose la logique côté client, pas de garantie d'idempotence.

### Décision 2 : Flag `welcome_sent` sur le modèle `User`

```prisma
model User {
  // ...existing fields...
  welcome_sent Boolean @default(false)
}
```

L'API `/api/user/welcome` vérifie `welcome_sent`. Si `false` : crée l'entrée User si elle n'existe pas, envoie l'email, met à jour `welcome_sent = true`. Si `true` : retourne `200` sans rien faire.

**Rationale :** Simple, cohérent avec le pattern existant (`alerts_enabled` sur `User`).

### Décision 3 : Redirection post-inscription vers `/test?welcome=1`

Pour les inscriptions sans `?from=test`, `RegisterForm` redirige vers `/test?welcome=1` au lieu de `/`. La page test lit ce paramètre et affiche un bandeau de bienvenue (CSS uniquement, sans état serveur).

**Rationale :** Le test est l'action la plus importante pour un nouveau user. Le `?welcome=1` permet un message contextuel sans complexité supplémentaire.

### Décision 4 : Appel `/api/user/welcome` depuis le callback d'auth

Dans `/auth/callback`, après `exchangeCodeForSession` réussi, faire un `fetch` interne vers `/api/user/welcome`. Cet appel est fire-and-forget côté redirect mais await côté serveur (< 500ms).

**Rationale :** Le callback est le seul point de passage garanti pour les sessions différées.

## Risks / Trade-offs

- **[Risque] Welcome envoyé avant que User soit créé en DB** → Mitigation : `/api/user/welcome` crée l'entrée `User` si elle n'existe pas (via `upsert`)
- **[Risque] Callback appelé lors d'un login (pas seulement inscription)** → Mitigation : le flag `welcome_sent` est idempotent — un 2e appel retourne 200 sans réenvoyer
- **[Trade-off] Appel fetch interne depuis le callback** → Légère latence (< 200ms) sur la redirection post-confirmation. Acceptable pour un MVP.

## Open Questions

- Quel `from` pour l'email de bienvenue ? (`hello@kraak.co` comme pour la waitlist, ou `onboarding@kraak.co` ?)
- Faut-il créer l'entrée `User` en DB à l'inscription, ou attendre le premier accès ?
