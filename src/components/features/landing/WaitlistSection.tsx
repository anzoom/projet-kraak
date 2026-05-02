import BetaCapture from "@/components/features/waitlist/BetaCapture"

export default function WaitlistSection() {
  return (
    <section id="beta" className="px-4 sm:px-6 py-16 sm:py-20 bg-white">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center h-7 px-4 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-4">
            🟢 Bêta gratuite — places limitées
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-dark mb-3 leading-tight">
            Rejoins les premiers utilisateurs KRAAK
          </h2>
          <p className="text-slate-mid text-sm leading-relaxed">
            Accès gratuit, feedback privilégié, conditions fondateurs.
          </p>
        </div>

        <BetaCapture
          source="landing"
          title="Ce qui t'intéresse"
          subtitle="Sélectionne un ou plusieurs services — on te prévient en avant-première."
          ctaLabel="Rejoindre la bêta gratuite →"
          compact={false}
        />

        {/* Micro-preuves */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { stat: "100%", label: "Gratuit pendant la bêta" },
            { stat: "< 1 min", label: "Pour voir tes résultats" },
            { stat: "0", label: "Carte bancaire requise" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-black text-primary">{item.stat}</span>
              <span className="text-xs text-slate-mid text-center">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
