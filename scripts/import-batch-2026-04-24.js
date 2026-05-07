// Import batch — opportunités vérifiées 2026-04-24
// 17 nouvelles entrées issues de la liste utilisateur (après dédup et vérification)
const { Client } = require('pg')

const DB_URL = 'postgresql://postgres:Y%40moussoukro9999@db.imthqokhjfanzhdihvsc.supabase.co:5432/postgres'

const OPPORTUNITIES = [
  {
    title: "Prix Aulagnon-Bettan — Sciences Po Paris",
    study_level: "bac5",
    category: "prix",
    domain: "sciences_sociales",
    country: "europe",
    funding_type: "partielle",
    deadline: "2026-06-19",
    budget_required: 0,
    short_description: "Prix annuel de 8 000 à 15 000 € décerné aux étudiants de première année à Sciences Po Paris qui s'engagent dans des projets à fort impact social. Cérémonie en juin.",
    source_url: "https://www.sciencespo.fr/students/en/campus-life-and-services/student-associations-initiatives/university-prizes-awards/aulagnon-bettan-prize/",
    eligibility_summary: "Étudiant(e) en 1ère année à Sciences Po Paris. Projet d'engagement social ou culturel démontré. Nomination par la communauté Sciences Po.",
    is_active: true,
  },
  {
    title: "Rennes School of Business — Bourses Excellence Master",
    study_level: "bac5",
    category: "bourse",
    domain: "commerce",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 3_000_000,
    short_description: "Rennes School of Business attribue plusieurs bourses post-admission aux étudiants en master : Parcours Talent, Unframed et Fonds de Solidarité, chacune d'un montant de 5 000 € de réduction sur la scolarité.",
    source_url: "https://www.rennes-sb.com/programmes/postgraduate/scholarships-master-programmes/",
    eligibility_summary: "Ouvert à tout candidat admis en master à RSB. Critères académiques et/ou sociaux selon la bourse choisie. Dépôt de dossier via la plateforme d'admission.",
    is_active: true,
  },
  {
    title: "MINES ParisTech CEMEF — Stages de Recherche en Science des Matériaux",
    study_level: "bac5",
    category: "fellowship",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "salariee",
    deadline: null,
    budget_required: 0,
    short_description: "Le CEMEF (Centre de Mise en Forme des Matériaux) de MINES ParisTech propose des stages de recherche rémunérés en science des matériaux, génie des procédés et mécanique numérique, en partenariat avec des industriels.",
    source_url: "https://applyfor.cemef.mines-paristech.fr/internship/",
    eligibility_summary: "Étudiants en master ou doctorat en science des matériaux, génie des procédés ou mécanique. Maîtrise de l'anglais ou du français. Candidature en ligne tout au long de l'année.",
    is_active: true,
  },
  {
    title: "American University of Paris (AUP) — Bourses pour Étudiants Internationaux",
    study_level: "bac3",
    category: "bourse",
    domain: "multidisciplinaire",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "L'AUP distribue plus de 4 millions € de bourses chaque année. Les AUP Scholar Awards couvrent jusqu'à 75 % des frais de scolarité. Prise en compte automatique à l'admission, critères académiques et financiers.",
    source_url: "https://www.aup.edu/admissions/undergraduate/financial-aid",
    eligibility_summary: "Étudiant(e) admis(e) en licence à l'AUP, toutes nationalités. Évaluation automatique des bourses au moment de l'admission. Critères : excellence académique et besoin financier démontré.",
    is_active: true,
  },
  {
    title: "PGSM — Bourses Paris Graduate School of Mathematical Sciences",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "Programme de bourses mensuelles de 1 150 € pour des masters en mathématiques, informatique ou physique à Paris, réservé aux étudiants internationaux n'ayant pas encore étudié en France.",
    source_url: "https://sciencesmaths-paris.fr/nos-programmes/pgsm-master",
    eligibility_summary: "Étudiants internationaux hors France, en mathématiques, informatique ou physique. Licence validée dans son pays d'origine. Pas de condition de nationalité. Candidature en ligne annuellement.",
    is_active: true,
  },
  {
    title: "EUR GENE — Bourse d'Excellence Master Génétique — Université Paris Cité",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "10 bourses annuelles pour étudiants internationaux en Master 2 Génétique à l'Université Paris Cité. Destinées aux candidats ayant validé leur M1 en dehors de la France.",
    source_url: "https://eur-gene.u-paris.fr/etudiants-internationaux-m2/",
    eligibility_summary: "Étudiant(e) non-français ayant validé le M1 hors de France. Programme M2 Génétique à l'Université Paris Cité. Très bon dossier académique. Candidature via le portail EUR GENE.",
    is_active: true,
  },
  {
    title: "Fondation HEC — Bourses d'Excellence pour Étudiants Internationaux",
    study_level: "bac5",
    category: "bourse",
    domain: "commerce",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 1_000_000,
    short_description: "La Fondation HEC attribue des bourses d'excellence aux meilleurs étudiants internationaux titulaires d'un bachelor hors France. Prise en compte automatique lors de l'admission à HEC Paris.",
    source_url: "https://www.hec.edu/en/programs/grande-ecole-program/fees-funding/scholarships-and-bursaries",
    eligibility_summary: "Titulaire d'un bachelor obtenu hors de France. Admis au programme Grande École ou MSc d'HEC Paris. Considération automatique à l'admission. Montant variable selon mérite et besoin.",
    is_active: true,
  },
  {
    title: "Bourse IdEx Université Grenoble Alpes — Excellence en Master",
    study_level: "bac5",
    category: "bourse",
    domain: "multidisciplinaire",
    country: "europe",
    funding_type: "partielle",
    deadline: "2026-05-05",
    budget_required: 0,
    short_description: "Bourses d'excellence pour étudiants internationaux en M1 (9 000 €) et M2 (5 500 €) à l'Université Grenoble Alpes. Couvre les frais de séjour. Candidature avant le 5 mai 2026.",
    source_url: "https://www.univ-grenoble-alpes.fr/formation/candidatures-et-admissions/bourse-graduate-school/",
    eligibility_summary: "Étudiants internationaux hors UE admis en M1 ou M2 à l'UGA. Dossier de candidature spécifique à soumettre avant le 5 mai 2026. Toutes disciplines de master.",
    is_active: true,
  },
  {
    title: "TIGER — Bourse d'Excellence PMI Aix-Marseille Université",
    study_level: "bac5",
    category: "bourse",
    domain: "multidisciplinaire",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "Bourse d'excellence jusqu'à 10 000 € attribuée automatiquement aux meilleurs candidats internationaux admis en master à l'Université Aix-Marseille. Pas de candidature séparée nécessaire.",
    source_url: "https://www.univ-amu.fr/fr/public/bourses-pmi-daix-marseille-universite",
    eligibility_summary: "Candidats internationaux admis en master à Aix-Marseille Université. Attribution automatique à l'admission selon le dossier académique. Toutes disciplines de master.",
    is_active: true,
  },
  {
    title: "EUR MCS — Bourse Master Mathématiques, Informatique & Sciences — Sorbonne Paris Nord",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "Allocation mensuelle de 600 à 1 000 € pour étudiants internationaux en master Mathématiques, Informatique et Sciences à l'Université Sorbonne Paris Nord (Paris 13).",
    source_url: "https://galilee.univ-paris13.fr/relations-internationales/bourse_eur_math/",
    eligibility_summary: "Étudiants internationaux candidats en M1 ou M2 en mathématiques, informatique ou sciences à Sorbonne Paris Nord. Dossier académique solide. Candidature annuelle en ligne.",
    is_active: true,
  },
  {
    title: "INSEAD Africa Leadership Fund — Bourse MBA pour Leaders Africains",
    study_level: "bac5",
    category: "bourse",
    domain: "commerce",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 0,
    short_description: "Bourse de 10 000 à 25 000 € pour leaders africains admis au MBA d'INSEAD. Réservée aux ressortissants africains ayant effectué leur parcours académique en Afrique et démontrant un besoin financier.",
    source_url: "https://www.insead.edu/insead-africa-leadership-fund-scholarship",
    eligibility_summary: "Ressortissant d'un pays africain. Avoir vécu et étudié en Afrique. Admis au MBA d'INSEAD (France ou Singapour). Besoin financier démontré. Candidature après admission.",
    is_active: true,
  },
  {
    title: "Institut Pasteur — Bourses Doctorales Calmette et Yersin",
    study_level: "doctorat",
    category: "bourse",
    domain: "sante",
    country: "europe",
    funding_type: "complete",
    deadline: null,
    budget_required: 0,
    short_description: "3 bourses doctorales annuelles pour les étudiants issus des instituts du Réseau International Pasteur. Financement complet incluant allocation, frais de formation et missions de recherche.",
    source_url: "https://www.pasteur.fr/en/education/doctoral-training/doctoral-grants/calmette-and-yersin-doctoral-grants",
    eligibility_summary: "Étudiant issu d'un institut du Réseau International Pasteur (Afrique, Asie, Moyen-Orient). Projet de thèse en biologie, santé ou infectiologie. Sélection par comité scientifique.",
    is_active: true,
  },
  {
    title: "OROSOUND — Bourse Master IMDEA pour Femmes — Université du Mans",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: "2026-06-01",
    budget_required: 0,
    short_description: "Bourse de 7 000 € réservée aux candidates féminines en master IMDEA (Électroacoustique et Audio) à l'Université du Mans. 2 bourses accordées par an (1 M1, 1 M2) pour favoriser la parité dans ce domaine.",
    source_url: "https://iags.univ-lemans.fr/en/education-programs/master-s-degrees-in-acoustics/parcours-en-anglais/imdea/scholarship-programs.html",
    eligibility_summary: "Candidates féminines au master IMDEA (International Master in Electroacoustics and Audio) à l'Université du Mans. Candidature du 5 janvier au 1er juin 2026. 2 bourses/an.",
    is_active: true,
  },
  {
    title: "IMDEA — Bourse Master Électroacoustique et Audio — Université du Mans",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: "2026-06-01",
    budget_required: 0,
    short_description: "Bourse de 7 000 € pour candidats au master IMDEA (Électroacoustique et Audio) à l'Université du Mans. 4 bourses attribuées par an (2 en M1, 2 en M2), ouvertes à tous candidats internationaux.",
    source_url: "https://iags.univ-lemans.fr/en/education-programs/master-s-degrees-in-acoustics/parcours-en-anglais/imdea/scholarship-programs.html",
    eligibility_summary: "Candidats internationaux au master IMDEA à l'Université du Mans. Tous niveaux de M1 ou M2. Candidature du 5 janvier au 1er juin 2026. 4 bourses accordées annuellement.",
    is_active: true,
  },
  {
    title: "Bourse Sophie Germain FMJH — Master de Mathématiques en Île-de-France",
    study_level: "bac5",
    category: "bourse",
    domain: "sciences_tech",
    country: "europe",
    funding_type: "partielle",
    deadline: "2026-06-01",
    budget_required: 0,
    short_description: "Bourse annuelle de 11 000 € (+ frais de transport et de conférence) pour les meilleurs étudiants en master de mathématiques en Île-de-France (Paris-Saclay, Sorbonne, Paris Cité…). 2e appel : deadline 1er juin 2026.",
    source_url: "https://www.fondation-hadamard.fr/fr/programmes/master/candidater-a-une-bourse-de-master/",
    eligibility_summary: "Étudiant(e) en master de mathématiques en Île-de-France. Excellents résultats académiques. Deux appels à candidatures par an. Candidature via la Fondation Mathématique Jacques Hadamard.",
    is_active: true,
  },
  {
    title: "Fellowship Jean d'Alembert — Chercheurs Invités Paris-Saclay",
    study_level: "doctorat",
    category: "fellowship",
    domain: "multidisciplinaire",
    country: "europe",
    funding_type: "salariee",
    deadline: "2026-05-31",
    budget_required: 0,
    short_description: "Programme d'accueil de 2 à 12 mois pour chercheurs et enseignants-chercheurs de pays en développement à l'Université Paris-Saclay. Bourse mensuelle + hébergement. Priorité aux candidats d'Afrique francophone.",
    source_url: "https://www.universite-paris-saclay.fr/recherche/programmes-et-financements/bourses-jean-dalembert",
    eligibility_summary: "Chercheur post-doctoral ou enseignant-chercheur de pays en développement (dont Afrique). Accueil par un laboratoire de Paris-Saclay. Séjour de 2 à 12 mois. Deadline : 31 mai 2026.",
    is_active: true,
  },
  {
    title: "EDHEC Business School — Bourse pour Étudiants Internationaux",
    study_level: "bac5",
    category: "bourse",
    domain: "commerce",
    country: "europe",
    funding_type: "partielle",
    deadline: null,
    budget_required: 3_000_000,
    short_description: "Bourse de 3 400 à 4 600 € pour les étudiants internationaux admis à EDHEC et ne pouvant accéder aux bourses CROUS françaises. Attribuée sur critères sociaux à la demande lors de l'admission.",
    source_url: "https://www.edhec.edu/fr/programmes/grande-ecole/admissions-et-financement/financement",
    eligibility_summary: "Étudiant(e) international(e) admis(e) à EDHEC Grande École. Sans accès aux bourses CROUS (ménage fiscal hors France). Montant : 3 400 à 4 600 € selon ressources familiales.",
    is_active: true,
  },
]

function slugify(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim()
}

async function main() {
  const client = new Client({ connectionString: DB_URL })
  await client.connect()

  const existing = await client.query('SELECT title FROM opportunities')
  const existingKeys = new Set(existing.rows.map(r => slugify(r.title).slice(0, 60)))

  console.log(`Existant en base: ${existingKeys.size} opportunités`)
  console.log(`À insérer: ${OPPORTUNITIES.length} nouvelles entrées\n`)

  let inserted = 0, skipped = 0
  for (const opp of OPPORTUNITIES) {
    const key = slugify(opp.title).slice(0, 60)
    if (existingKeys.has(key)) {
      console.log(`⏭  Déjà en base: ${opp.title}`)
      skipped++
      continue
    }

    const deadline = opp.deadline ? new Date(opp.deadline + 'T12:00:00Z').toISOString() : null

    try {
      await client.query(`
        INSERT INTO opportunities
          (title, study_level, category, domain, country, funding_type,
           deadline, budget_required, short_description, source_url,
           eligibility_summary, is_active, updated_at, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
      `, [
        opp.title, opp.study_level, opp.category, opp.domain,
        opp.country, opp.funding_type,
        deadline, opp.budget_required,
        opp.short_description, opp.source_url,
        opp.eligibility_summary, opp.is_active,
      ])
      existingKeys.add(key)
      inserted++
      console.log(`✅ Inséré: ${opp.title}`)
    } catch (e) {
      console.error(`❌ Erreur insertion: ${opp.title}`)
      console.error(`   ${e.message}`)
    }
  }

  const total = await client.query('SELECT COUNT(*) FROM opportunities')
  console.log(`\n────────────────────────────────────────`)
  console.log(`Inséré: ${inserted} | Ignoré: ${skipped} | Total en base: ${total.rows[0].count}`)

  // Distribution par catégorie
  const cats = await client.query('SELECT category, COUNT(*) as n FROM opportunities GROUP BY category ORDER BY n DESC')
  console.log('\nDistribution par catégorie:')
  cats.rows.forEach(r => console.log(`  ${r.category}: ${r.n}`))

  await client.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
