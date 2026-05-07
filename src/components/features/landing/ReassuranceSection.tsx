import { BadgeCheck, Zap, Lock } from "lucide-react";

const items = [
  {
    icon: BadgeCheck,
    title: "Sources officielles uniquement",
    description:
      "Chaque opportunité est extraite de sources vérifiées : institutions universitaires, organisations internationales, programmes gouvernementaux.",
  },
  {
    icon: Zap,
    title: "Résultat en moins d'1 minute",
    description:
      "10 questions courtes. Un scoring instantané. Tu sais exactement quelles opportunités te correspondent avant même d'avoir pris ton café.",
  },
  {
    icon: Lock,
    title: "Tes données restent privées",
    description:
      "Tes réponses servent uniquement à personnaliser tes recommandations. Elles ne sont jamais revendues ni partagées avec des tiers.",
  },
];

export default function ReassuranceSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-3">
            Tu peux nous faire confiance
          </h2>
          <p className="text-slate-mid text-lg max-w-lg mx-auto">
            La fiabilité de l'information est notre priorité absolue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-gray-100"
              >
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-slate-dark">{item.title}</h3>
                <p className="text-slate-mid text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
