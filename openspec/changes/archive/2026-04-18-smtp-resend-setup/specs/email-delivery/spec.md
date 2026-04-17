## ADDED Requirements

### Requirement: SMTP Resend configuré dans Supabase
Supabase SHALL utiliser Resend comme relay SMTP pour l'envoi de tous les emails transactionnels (confirmation d'inscription, réinitialisation de mot de passe). La configuration se fait dans Supabase Dashboard → Project Settings → Auth → SMTP Settings avec les paramètres Resend.

#### Scenario: Email de confirmation reçu après inscription
- **WHEN** un utilisateur s'inscrit sur `/auth/register`
- **THEN** un email de confirmation est reçu dans la boîte mail dans les 60 secondes, sans erreur SMTP dans les logs Supabase

#### Scenario: Limite de débit supprimée
- **WHEN** plus de 2 emails sont envoyés dans la même heure
- **THEN** tous les emails sont délivrés sans erreur de rate limit (pas de "Email rate limit exceeded" dans les logs)

#### Scenario: Test SMTP depuis le dashboard
- **WHEN** le bouton "Test SMTP" est cliqué dans Supabase Dashboard → Auth → SMTP Settings
- **THEN** un email de test est reçu à l'adresse configurée, confirmant que la connexion Resend est opérationnelle

### Requirement: Adresse d'expéditeur configurée
L'adresse d'expéditeur des emails Supabase SHALL être `onboarding@resend.dev` en développement et `noreply@kraak.app` en production (après vérification du domaine dans Resend).

#### Scenario: Email reçu avec la bonne adresse expéditeur en dev
- **WHEN** un email de confirmation est envoyé en environnement de développement
- **THEN** l'expéditeur affiché est `onboarding@resend.dev` ou l'adresse sandbox Resend configurée

#### Scenario: Domaine vérifié requis en production
- **WHEN** le déploiement en production est effectué
- **THEN** le domaine `kraak.app` MUST être vérifié dans Resend Dashboard avant d'utiliser `noreply@kraak.app` comme expéditeur
