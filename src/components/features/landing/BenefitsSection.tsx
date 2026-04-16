import { Clock, Target, ShieldCheck, MapPin } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Gagne du temps",
    description:
      "Fini de naviguer entre des dizaines de sites. KRAAK centralise les meilleures opportunités et te les présente en fonction de ton profil.",
  },
  {
    icon: Target,
    title: "Recommandations personnalisées",
    description:
      "Pas de liste générique. Chaque opportunité est sélectionnée pour toi selon ton niveau, tes objectifs et ta situation.",
  },
  {
    icon: ShieldCheck,
    title: "Données vérifiées",
    description:
      "Toutes les opportunités proviennent de sources fiables : universités, organismes officiels, programmes d'échange reconnus.",
  },
  {
    icon: MapPin,
    title: "Plan d'action concret",
    description:
      "Au-delà des listes, KRAAK t'explique pourquoi chaque opportunité est pertinente et comment maximiser tes chances.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-slate-light">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-3">
            Pourquoi choisir KRAAK ?
          </h2>
          <p className="text-slate-mid text-lg max-w-lg mx-auto">
            Conçu pour les étudiants africains qui veulent avancer vite et sans se perdre.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 flex gap-4 shadow-sm border border-gray-100"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-dark mb-1">{benefit.title}</h3>
                  <p className="text-slate-mid text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
