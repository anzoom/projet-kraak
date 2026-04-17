## 1. Créer le compte Resend et générer l'API key

- [x] 1.1 Créer un compte sur resend.com (gratuit — 3 000 emails/mois)
- [x] 1.2 Dans Resend Dashboard → API Keys → créer une clé avec le nom "kraak-supabase-smtp"
- [x] 1.3 Copier la clé générée (elle ne sera affichée qu'une fois)

## 2. Configurer le SMTP dans Supabase

- [x] 2.1 Ouvrir Supabase Dashboard → Project Settings → Auth → SMTP Settings
- [x] 2.2 Activer "Enable Custom SMTP"
- [x] 2.3 Renseigner les paramètres :
  - Host : `smtp.resend.com`
  - Port : `465`
  - User : `resend`
  - Password : (coller l'API key Resend)
  - Sender name : `KRAAK`
  - Sender email : `onboarding@resend.dev`
- [x] 2.4 Sauvegarder la configuration

## 3. Tester la configuration

- [x] 3.1 Cliquer "Send test email" dans Supabase Dashboard → Auth → SMTP Settings et vérifier la réception
- [x] 3.2 Faire le parcours complet : `/test` → compléter les questions → inscription → vérifier réception de l'email de confirmation
- [x] 3.3 Cliquer le lien de confirmation → vérifier la redirection vers `/results` avec les résultats

## 4. Préparer la production (à faire avant déploiement Vercel)

- [ ] 4.1 Dans Resend Dashboard → Domains → ajouter `kraak.app` et suivre les instructions de vérification DNS
- [ ] 4.2 Une fois le domaine vérifié, mettre à jour l'adresse expéditeur dans Supabase de `onboarding@resend.dev` vers `noreply@kraak.app`
- [ ] 4.3 Répéter le test d'envoi (tâche 3.1) avec la nouvelle adresse expéditeur
