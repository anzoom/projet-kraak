## 1. Modèle de données

- [x] 1.1 Ajouter le modèle `WaitlistEntry` dans `prisma/schema.prisma` (id, email unique, source, created_at)
- [x] 1.2 Créer le fichier de migration SQL `prisma/migrations/20260426100000_add_waitlist_entry/migration.sql`
- [x] 1.3 Exécuter `prisma generate` pour régénérer le client Prisma
- [x] 1.4 Appliquer la migration avec `prisma migrate deploy`

## 2. API liste d'attente

- [x] 2.1 Créer `src/app/api/guide-premium/waitlist/route.ts` (POST) : valider l'email, créer `WaitlistEntry`, gérer le doublon P2002, retourner `{ success: true }`
- [x] 2.2 Ajouter l'envoi de l'email de confirmation via Resend (fire-and-forget, ne bloque pas la réponse)

## 3. Page /guide-premium

- [x] 3.1 Créer le répertoire `src/app/(app)/(public)/guide-premium/` et le fichier `page.tsx` (Server Component)
- [x] 3.2 Implémenter la section hero : titre, accroche, proposition de valeur KRAAK Premium Guide
- [x] 3.3 Implémenter la section bénéfices : guide interactif, alertes, newsletter, catalogue complet
- [x] 3.4 Implémenter la section tarifs : mensuel 2 500 XOF / annuel 19 900 XOF (annuel mis en avant)
- [x] 3.5 Implémenter le formulaire liste d'attente (Client Component) : input email, bouton, feedback succès/erreur/déjà inscrit
- [x] 3.6 Ajouter le lien de retour contextuel (vers `/catalog`)
