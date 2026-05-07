"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "KRAAK est-il vraiment gratuit ?",
    a: "Oui, complètement. KRAAK est en phase bêta gratuite : tu accèdes au test de profil, à tes recommandations personnalisées et au guide sans payer quoi que ce soit. Les offres payantes (Guide Premium complet, Coaching) arrivent plus tard — et les membres fondateurs bénéficieront de conditions spéciales.",
  },
  {
    q: "À qui s'adresse KRAAK ?",
    a: "KRAAK est conçu pour les étudiants africains (16-30 ans), les jeunes diplômés du continent et la diaspora qui cherchent des bourses, fellowships, programmes d'échange, formations et opportunités académiques à l'international. La plateforme est disponible en français et couvre toute l'Afrique.",
  },
  {
    q: "Comment fonctionne le test de profil ?",
    a: "Tu réponds à 10 questions sur ton niveau d'études, ta situation, tes objectifs et tes contraintes. En moins d'1 minute, KRAAK analyse ton profil et sélectionne les opportunités les plus adaptées à ta situation — pas une liste générique, mais des recommandations personnalisées.",
  },
  {
    q: "Est-ce que KRAAK garantit que j'obtiendrai une bourse ?",
    a: "Non. KRAAK t'aide à identifier les opportunités les plus pertinentes pour ton profil et à mieux préparer tes candidatures — mais le résultat final dépend de ta candidature et des critères de sélection de chaque programme. On te donne les meilleures chances, pas une garantie.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Oui. Nous ne partageons ni ne vendons tes données personnelles. Ton email et les informations de ton profil sont utilisés uniquement pour personnaliser ton expérience et t'envoyer des opportunités pertinentes. Tu peux te désinscrire à tout moment.",
  },
  {
    q: "Comment puis-je donner mon avis sur KRAAK ?",
    a: "C'est exactement ce qu'on cherche ! Tu peux répondre directement aux emails que tu reçois, écrire à hello@kraak.co ou utiliser le formulaire de bêta ci-dessus. Chaque retour nous aide à améliorer la plateforme.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-4 text-left gap-4"
      >
        <span className="font-bold text-slate-dark text-sm leading-snug">{q}</span>
        <ChevronDown
          className={[
            "w-4 h-4 text-slate-mid shrink-0 mt-0.5 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-mid leading-relaxed pb-4">{a}</p>
      )}
    </div>
  )
}

export default function FaqSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-slate-light">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-dark mb-3">Questions fréquentes</h2>
          <p className="text-slate-mid text-base">Tout ce que tu dois savoir avant de commencer.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 px-6 divide-y divide-gray-100 shadow-sm">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
        <p className="text-center text-sm text-slate-mid mt-6">
          Une autre question ?{" "}
          <a href="mailto:hello@kraak.co" className="text-primary font-semibold hover:underline">
            hello@kraak.co
          </a>
        </p>
      </div>
    </section>
  )
}
