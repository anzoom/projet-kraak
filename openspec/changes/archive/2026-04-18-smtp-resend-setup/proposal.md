## Why

Supabase free tier limite l'envoi d'emails à 2 par heure, ce qui bloque les tests et rendra l'onboarding utilisateur impossible en production. Configurer Resend comme SMTP custom dans Supabase supprime cette limite et assure une délivrabilité fiable pour les emails de confirmation.

## What Changes

- Configuration de Resend comme fournisseur SMTP dans Supabase Dashboard (settings manuels, hors code)
- Ajout de `RESEND_API_KEY` dans `.env.local` et les variables Vercel
- Création d'un domaine d'envoi vérifié dans Resend (ou utilisation du domaine sandbox pour le dev)
- Vérification du parcours email complet : inscription → réception email → confirmation → `/results`

## Capabilities

### New Capabilities
- `email-delivery`: Configuration SMTP Resend pour Supabase — délivrabilité des emails transactionnels (confirmation, reset mot de passe)

### Modified Capabilities

## Impact

- Aucune modification de code applicatif (configuration externe uniquement)
- `.env.local` : ajout de `RESEND_API_KEY`
- Supabase Dashboard : SMTP Settings mis à jour
- Vercel : variable `RESEND_API_KEY` à ajouter en staging/prod
- Dépendance : compte Resend (gratuit jusqu'à 3 000 emails/mois)
