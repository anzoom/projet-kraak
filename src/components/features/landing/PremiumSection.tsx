import { BookOpen, Users, Clock, ShieldCheck, Plane } from "lucide-react"

export default function PremiumSection() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 bg-slate-dark">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-4">
            <Clock className="w-3.5 h-3.5" />
            Bientôt disponible
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Trouve les opportunités.<br />
            <span className="text-primary">Décroche-les.</span>
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed">
            Guide Premium, Coaching individuel, aide visa et préparation au départ — tout ce qu&apos;il faut pour aller jusqu&apos;au bout.
          </p>
        </div>

        {/* Grille 2×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Guide Premium */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                Gratuit pendant la bêta
              </span>
            </div>
            <h3 className="text-lg font-black text-white mb-2">Guide Premium</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              9 modules pour maîtriser ta candidature de A à Z — mindset, dossier, rédaction,
              entretien, stratégie — plus 20 recommandations matching personnalisées.
            </p>
          </div>

          {/* Coaching individuel */}
          <div className="bg-primary rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/20 text-white text-xs font-bold">
                Lancement imminent
              </span>
            </div>
            <h3 className="text-lg font-black text-white mb-2">Coaching individuel</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Un expert KRAAK analyse ton dossier et te donne un plan d&apos;action sur-mesure.
              Pour les opportunités qui comptent vraiment, ne laisse rien au hasard.
            </p>
          </div>

          {/* Aide visa */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/10 text-white/60 text-xs font-semibold">
                Bientôt
              </span>
            </div>
            <h3 className="text-lg font-black text-white mb-2">Aide démarches visa</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Le refus de visa est la première cause d&apos;abandon d&apos;une opportunité internationale.
              On t&apos;aide à soumettre un dossier solide dès la première tentative.
            </p>
          </div>

          {/* Voyage & Hébergement */}
          <div className="bg-primary rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                Bientôt
              </span>
            </div>
            <h3 className="text-lg font-black text-white mb-2">Voyage & Hébergement</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Partir bien préparé, c&apos;est aussi une condition de réussite. Budget, logement,
              installation — on t&apos;évite les mauvaises surprises à l&apos;arrivée.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
