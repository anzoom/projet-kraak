import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/features/landing/Footer"

export const metadata: Metadata = {
  title: "Conditions d'utilisation — KRAAK",
  description: "Conditions d'utilisation de la plateforme KRAAK.",
}

export default function ConditionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-primary font-medium hover:underline">← Retour à l&apos;accueil</Link>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-1">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-gray-400 mb-2">Dernière mise à jour : mai 2026</p>
        <p className="text-xs text-gray-500 mb-10 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
          KRAAK est actuellement en <strong>phase bêta gratuite</strong>. Aucune offre payante n&apos;est active.
          Les fonctionnalités premium décrites dans ces conditions sont <strong>en cours de développement</strong> et seront proposées ultérieurement.
        </p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Présentation du projet</h2>
            <p>
              KRAAK (<strong>kraak.co</strong>) est une plateforme numérique d&apos;orientation destinée aux étudiants
              africains et à la diaspora. Elle aide l&apos;utilisateur à identifier les opportunités — bourses,
              programmes d&apos;échange, fellowships, formations — les plus adaptées à son profil.
            </p>
            <p className="mt-2 text-gray-600">
              KRAAK est un projet indépendant, actuellement en phase bêta. Aucune entité commerciale formellement constituée n&apos;opère à ce stade.
              Pour tout contact : <strong>hello@kraak.co</strong>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Acceptation</h2>
            <p>
              L&apos;utilisation de KRAAK implique l&apos;acceptation des présentes conditions.
              Si tu n&apos;acceptes pas ces conditions, tu ne dois pas utiliser la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Service actuellement disponible</h2>
            <p className="mb-2">Pendant la phase bêta, KRAAK propose gratuitement :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Un <strong>test de profil</strong> (10 questions) pour identifier les opportunités correspondant à ta situation</li>
              <li>Jusqu&apos;à <strong>10 recommandations personnalisées</strong> issues du catalogue KRAAK (5 affichées initialement)</li>
              <li>L&apos;accès à la <strong>liste d&apos;attente</strong> pour être prévenu des nouvelles fonctionnalités</li>
              <li>Un <strong>formulaire de feedback</strong> pour contribuer à l&apos;amélioration du produit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Fonctionnalités à venir</h2>
            <p className="mb-2 text-gray-600">
              Les fonctionnalités suivantes sont en cours de développement. Elles seront proposées progressivement,
              certaines gratuitement et d&apos;autres dans le cadre d&apos;offres payantes futures :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Guide Premium</strong> — 9 modules de formation pour maximiser ses candidatures</li>
              <li><strong>Catalogue élargi</strong> — accès à 20 recommandations personnalisées (vs 10 en compte gratuit)</li>
              <li><strong>Accompagnement individuel</strong> — conseil sur dossier avec un conseiller KRAAK</li>
              <li><strong>Alertes deadlines</strong> — rappels automatiques avant les dates limites de candidature</li>
              <li><strong>Newsletter éditoriale</strong> — sélection hebdomadaire des meilleures opportunités</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Aucune de ces fonctionnalités n&apos;est accessible par abonnement ou paiement pendant la phase bêta.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Accès et inscription</h2>
            <p>
              L&apos;accès au service nécessite la création d&apos;un compte avec une adresse email valide.
              L&apos;utilisateur s&apos;engage à fournir des informations exactes et à ne pas créer plusieurs comptes.
              Tout accès non autorisé doit être signalé immédiatement à <strong>hello@kraak.co</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Conditions d&apos;âge</h2>
            <p>
              L&apos;accès à KRAAK est ouvert à toute personne âgée de <strong>16 ans minimum</strong>.
              Les mineurs de moins de 16 ans doivent obtenir l&apos;autorisation d&apos;un parent ou tuteur légal.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">7. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus de KRAAK (textes, algorithmes de matching, base d&apos;opportunités, design)
              est la propriété de son auteur et protégé par le droit applicable.
              Toute reproduction ou exploitation non autorisée est interdite.
            </p>
            <p className="mt-2 text-gray-600">
              Les opportunités référencées sur KRAAK sont issues de sources publiques tierces.
              KRAAK ne garantit pas leur exactitude ni leur disponibilité à un instant donné.
              L&apos;utilisateur est invité à vérifier les informations directement auprès des organismes concernés.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">8. Comportements interdits</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tenter d&apos;accéder aux données d&apos;autres utilisateurs</li>
              <li>Extraire automatiquement des données de la plateforme (scraping)</li>
              <li>Diffuser des informations fausses ou trompeuses</li>
              <li>Perturber le fonctionnement du service</li>
              <li>Contourner les mécanismes d&apos;authentification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">9. Limitation de responsabilité</h2>
            <p>
              KRAAK fournit un service de recommandation à titre indicatif, dans le cadre d&apos;une phase
              de test non commerciale. Les informations sur les opportunités sont collectées auprès de sources
              publiques et peuvent être inexactes, incomplètes ou obsolètes.
            </p>
            <p className="mt-2 text-gray-600">
              KRAAK ne peut être tenu responsable des décisions prises sur la base de ces recommandations,
              ni du résultat de candidatures soumises, ni des interruptions de service liées à des prestataires tiers.
            </p>
            <p className="mt-2 text-gray-600">
              Le service est fourni <em>en l&apos;état</em> (as-is) pendant la phase bêta. Des dysfonctionnements
              peuvent survenir. Aucune garantie de disponibilité continue n&apos;est donnée à ce stade.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">10. Suppression du compte</h2>
            <p>
              L&apos;utilisateur peut supprimer son compte et ses données à tout moment en contactant{" "}
              <strong>hello@kraak.co</strong>. La suppression est effective sous 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">11. Modifications</h2>
            <p>
              Ces conditions peuvent évoluer au fur et à mesure de la maturation du projet
              (structuration juridique, activation des offres premium, etc.).
              Les utilisateurs seront informés par email en cas de modification substantielle,
              avec un préavis d&apos;au moins 15 jours.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">12. Contact</h2>
            <p>
              Pour toute question, signalement ou exercice de tes droits :{" "}
              <strong>hello@kraak.co</strong>
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
