import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/features/landing/Footer"

export const metadata: Metadata = {
  title: "Politique de confidentialité — KRAAK",
  description: "Comment KRAAK collecte, utilise et protège tes données personnelles.",
}

export default function ConfidentialitePage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary font-medium hover:underline">← Retour à l&apos;accueil</Link>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-1">Politique de confidentialité</h1>
        <p className="text-sm text-gray-400 mb-2">Dernière mise à jour : mai 2026</p>
        <p className="text-xs text-gray-400 mb-10 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
          KRAAK est actuellement en phase bêta gratuite. Aucune transaction commerciale n&apos;est effectuée à ce stade.
        </p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Responsable du traitement</h2>
            <p>
              KRAAK (<strong>kraak.co</strong>) est un projet indépendant actuellement en phase bêta.
              Pour toute question relative à tes données personnelles :{" "}
              <strong>hello@kraak.co</strong>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">2. Données collectées et finalités</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 border border-gray-200 font-semibold">Donnée</th>
                    <th className="text-left p-3 border border-gray-200 font-semibold">Finalité</th>
                    <th className="text-left p-3 border border-gray-200 font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200">Adresse email</td>
                    <td className="p-3 border border-gray-200">Authentification, communications, liste d&apos;attente</td>
                    <td className="p-3 border border-gray-200">Consentement / intérêt légitime</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-200">Réponses au test (pays, niveau, objectif…)</td>
                    <td className="p-3 border border-gray-200">Calcul du scoring, recommandations personnalisées</td>
                    <td className="p-3 border border-gray-200">Consentement</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200">Intérêts déclarés (formulaire bêta : services sélectionnés)</td>
                    <td className="p-3 border border-gray-200">Priorisation des développements, notification avant lancement</td>
                    <td className="p-3 border border-gray-200">Consentement</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-200">Données de navigation (pages vues, clics)</td>
                    <td className="p-3 border border-gray-200">Amélioration du produit, analytics</td>
                    <td className="p-3 border border-gray-200">Intérêt légitime</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Aucune donnée bancaire ou de paiement n&apos;est collectée à ce stade. KRAAK ne traite aucune transaction financière pendant la phase bêta.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Durée de conservation</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données de compte : jusqu&apos;à suppression du compte + 12 mois</li>
              <li>Réponses au test : 24 mois après la dernière connexion</li>
              <li>Données de la liste d&apos;attente : jusqu&apos;à désinscription ou 24 mois d&apos;inactivité</li>
              <li>Logs techniques : 90 jours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Destinataires des données</h2>
            <p className="mb-2">Tes données sont traitées par les prestataires techniques suivants, dans le cadre strict de leurs missions :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> — authentification et stockage des données (USA, clauses contractuelles standard UE)</li>
              <li><strong>Vercel</strong> — hébergement de l&apos;application (USA, clauses contractuelles standard UE)</li>
              <li><strong>Resend</strong> — envoi d&apos;emails transactionnels (confirmations, alertes)</li>
              <li><strong>PostHog</strong> — analytics d&apos;usage anonymisés (serveurs Union européenne)</li>
              <li><strong>Sentry</strong> — journalisation des erreurs techniques (sans données d&apos;identification)</li>
              <li><strong>Upstash</strong> — protection contre les abus et limitation de débit</li>
            </ul>
            <p className="mt-3 text-gray-500">
              Aucune donnée n&apos;est vendue ou cédée à des tiers, ni utilisée à des fins publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Tes droits</h2>
            <p className="mb-2">
              Tu disposes des droits suivants concernant tes données personnelles :{" "}
              <strong>accès, rectification, suppression, portabilité, opposition, limitation.</strong>
            </p>
            <p>
              Pour exercer ces droits ou supprimer ton compte : <strong>hello@kraak.co</strong>.
              Nous répondons sous 30 jours.
            </p>
            <p className="mt-2 text-gray-500">
              Les résidents de l&apos;Union européenne et pays appliquant le RGPD peuvent également
              saisir l&apos;autorité de protection des données compétente dans leur pays.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Utilisateurs mineurs</h2>
            <p>
              KRAAK est accessible dès 16 ans. Pour les utilisateurs de moins de 16 ans,
              le consentement parental est requis. Si tu es parent et penses que ton enfant
              a créé un compte sans autorisation, contacte-nous à <strong>hello@kraak.co</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">7. Cookies et traceurs</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cookies techniques</strong> — essentiels au fonctionnement (session, authentification), aucun consentement requis</li>
              <li><strong>Cookies analytics</strong> — PostHog, mesure d&apos;audience anonymisée</li>
            </ul>
            <p className="mt-2 text-gray-500">
              Tu peux refuser les cookies analytics sans impact sur l&apos;accès au service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">8. Modifications</h2>
            <p>
              Cette politique peut être mise à jour au fur et à mesure de l&apos;évolution du projet.
              En cas de modification substantielle, tu seras informé par email.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Des questions ?{" "}
              <Link href="/contact" className="text-primary hover:underline">Contacte-nous</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
