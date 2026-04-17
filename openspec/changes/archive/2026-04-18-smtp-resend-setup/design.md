## Context

Supabase Auth envoie les emails transactionnels (confirmation, reset mot de passe) via son propre serveur SMTP par défaut, limité à 2 emails/heure sur le free tier. Resend est déjà listé dans l'architecture KRAAK comme fournisseur d'emails. La configuration se fait entièrement dans le dashboard Supabase — aucune modification du code Next.js n'est requise.

## Goals / Non-Goals

**Goals:**
- Remplacer le SMTP Supabase par défaut par Resend
- Supprimer la limite de 2 emails/heure
- Valider le parcours email complet en dev et préparer la prod

**Non-Goals:**
- Envoyer des emails custom depuis le code Next.js via Resend SDK (futur — notifications, rappels)
- Personnaliser les templates email Supabase (hors périmètre MVP)
- Configurer un domaine custom vérifié en dev (le sandbox Resend suffit)

## Decisions

### D1 — Utiliser Resend comme relay SMTP (pas le SDK)
**Décision :** Configurer Resend via les paramètres SMTP de Supabase (`smtp.resend.com`, port 465, TLS), pas via le SDK `resend` npm.
**Rationale :** Supabase gère déjà tous les templates et la logique d'envoi — on remplace juste le transport. Le SDK Resend serait utile pour des emails custom mais n'est pas nécessaire ici.

### D2 — Adresse d'expéditeur `noreply@resend.dev` en dev
**Décision :** Utiliser le domaine sandbox Resend (`onboarding@resend.dev`) en développement, et un domaine vérifié (ex: `noreply@kraak.app`) en production.
**Rationale :** La vérification de domaine prend du temps et nécessite l'accès DNS. Le sandbox permet de tester immédiatement.

### D3 — `RESEND_API_KEY` dans `.env.local` uniquement
**Décision :** La clé API Resend est configurée directement dans le dashboard Supabase, pas dans `.env.local` pour l'instant. Elle sera ajoutée dans Vercel lors du déploiement staging.
**Rationale :** La clé sert au SMTP Supabase, pas au code applicatif. La stocker dans `.env.local` n'a pas d'utilité tant qu'on n'utilise pas le SDK Resend.

## Risks / Trade-offs

- **Quota Resend gratuit (3 000 emails/mois)** → Largement suffisant pour le MVP, surveiller en prod.
- **Vérification domaine requise pour la prod** → DNS peut prendre 24-48h. À anticiper avant le déploiement Vercel.
- **Clé API dans le dashboard Supabase** → Si la clé est compromise, la régénérer dans Resend et mettre à jour Supabase. Pas d'impact sur le code.

## Migration Plan

1. Créer un compte Resend (gratuit) et générer une API key
2. Dans Supabase Dashboard → Project Settings → Auth → SMTP Settings : activer et configurer avec les credentials Resend
3. Tester l'envoi depuis Supabase Dashboard (bouton "Test SMTP")
4. Vérifier réception de l'email de confirmation dans la boîte mail
5. Valider le parcours complet : `/test` → inscription → email → callback → `/results`
6. Pour la prod : vérifier le domaine `kraak.app` dans Resend et mettre à jour l'adresse d'expéditeur
