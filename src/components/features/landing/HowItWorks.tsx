import { ClipboardList, Sparkles, Unlock } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Réponds à 10 questions",
    description:
      "Niveau, objectif, domaine, budget… Un questionnaire simple conçu pour cerner ton profil en moins de 2 minutes.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "KRAAK analyse ton profil",
    description:
      "Notre moteur calcule ton score académique, financier et de maturité pour identifier les opportunités qui te correspondent.",
  },
  {
    number: "03",
    icon: Unlock,
    title: "Accède à tes opportunités",
    description:
      "Reçois une liste personnalisée de bourses, formations et programmes avec les explications de pourquoi ils sont faits pour toi.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-slate-mid text-lg max-w-lg mx-auto">
            Simple, rapide, personnalisé — du profil à l'opportunité en quelques clics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                    {step.number.replace("0", "")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-dark">{step.title}</h3>
                <p className="text-slate-mid text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
