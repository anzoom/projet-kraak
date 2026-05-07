// Script d'import des opportunités CSV vers Supabase
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const DB_URL = 'postgresql://postgres:Y%40moussoukro9999@db.imthqokhjfanzhdihvsc.supabase.co:5432/postgres'

// ── Normalisation ────────────────────────────────────────────────────────────

function normalizeCountry(raw) {
  const v = (raw || '').toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').trim()

  if (['france','belgique','royaume uni','uk','europe','allemagne','suisse',
       'espagne','italie','hongrie','pays bas','netherlands','pologne',
       'scandinavie','nord europe'].some(k => v.includes(k))) return 'europe'
  if (['turquie'].some(k => v.includes(k))) return 'europe'
  if (['canada','usa','etats unis','amerique du nord','united states'].some(k => v.includes(k))) return 'amerique_nord'
  if (['maroc','egypte','senegal','cote d ivoire','nigeria','ghana','kenya',
       'liberia','mauritius','afrique','africa','ethiopie','tanzanie',
       'ouganda','cameroun','rdc','mali','niger'].some(k => v.includes(k))) return 'afrique'
  if (['japon','chine','singapour','coree','korea','asie','asia','chine'].some(k => v.includes(k))) return 'asie'
  if (['australie','australia','oceanie'].some(k => v.includes(k))) return 'oceanie'
  if (['arabie','saudi','moyen orient','middle east'].some(k => v.includes(k))) return 'moyen_orient'
  if (['international','commonwealth','mondial','worldwide','multi','global',
       'afrique et moyen'].some(k => v.includes(k))) return 'international'
  return 'international'
}

function normalizeStudyLevel(raw) {
  const v = (raw || '').toLowerCase().trim()
  if (v.includes('doctorat') || v.includes('phd') || v.includes('doc')) return 'doctorat'
  if (v.includes('bac5') || v.includes('bac+5') || v.includes('master') || v.includes('bac 5')) return 'bac5'
  if (v.includes('bac3') || v.includes('bac+3') || v.includes('licence') || v === 'bac3+') return 'bac3'
  if (v.includes('bac2') || v.includes('bac+2')) return 'bac2'
  if (v === 'bac' || v === 'bac / bac2+' || v.includes('lyceen') || v.includes('terminale')) return 'bac'
  if (v.includes('tous') || v.includes('all') || v === '') return 'tous'
  return 'tous'
}

function normalizeFundingType(raw) {
  const v = (raw || '').toLowerCase().trim()
  if (v === 'complete' || v === 'complete' || v.includes('complet') || v.includes('full')) return 'complete'
  if (v === 'salariee' || v.includes('salar') || v.includes('stipend') || v.includes('subvention')) return 'salariee'
  if (v === 'non_financee' || v.includes('non_financee') || v.includes('gratuit') || v.includes('free') ||
      v.includes('application') || v.includes('autofinance')) return 'non_financee'
  if (v === 'partielle' || v === 'partial' || v.includes('partiel') || v.includes('variable')) return 'partielle'
  return 'partielle'
}

function normalizeCategory(raw) {
  const v = (raw || '').toLowerCase().trim()
  if (v === 'bourse') return 'bourse'
  if (v === 'stage') return 'stage'
  if (v === 'emploi') return 'emploi'
  if (v === 'echange' || v === 'programme' || v === 'fellowship') return 'programme'
  return 'formation'
}

function normalizeDomain(raw) {
  const v = (raw || '').toLowerCase().trim()
  if (['multidisciplin','tous','variable','all','multi'].some(k => v.includes(k))) return 'multidisciplinaire'
  if (['info', 'num', 'tech', 'stim', 'stem', 'science', 'ingenierie', 'coding',
       'maritime', 'agri', 'agriculture'].some(k => v.includes(k))) return 'sciences_tech'
  if (['commerce', 'business', 'management', 'entrepreneuriat', 'entrepreneur',
       'finance', 'economie', 'developpement'].some(k => v.includes(k))) return 'commerce'
  if (['droit', 'law', 'sciences politiques', 'politique', 'gouvern',
       'publiques'].some(k => v.includes(k))) return 'droit_sciences_po'
  if (['sante', 'medecin', 'medical', 'health', 'public health'].some(k => v.includes(k))) return 'sante'
  if (['social', 'humain', 'communaut', 'leadership', 'journalisme', 'media',
       'communication', 'arts', 'lettres'].some(k => v.includes(k))) return 'sciences_sociales'
  return 'multidisciplinaire'
}

function cleanText(s) {
  if (!s) return null
  // Fix encoding artifacts
  return s
    .replace(/Ã©/g, 'é').replace(/Ã¨/g, 'è').replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â').replace(/Ã«/g, 'ë').replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô').replace(/Ã¹/g, 'ù').replace(/Ã»/g, 'û')
    .replace(/Ã§/g, 'ç').replace(/Ã¦/g, 'æ').replace(/Å/g, 'œ')
    .replace(/â€™/g, "'").replace(/â€"/g, '–').replace(/â€œ/g, '"')
    .replace(/â€/g, '"').replace(/âˆ'/g, '−')
    .replace(/Ã‰/g, 'É').replace(/Ã/g, 'À').replace(/Ã‡/g, 'Ç')
    .replace(/Ã›/g, 'Û').replace(/Ã"/g, 'Ó')
    .trim()
}

function parseDeadline(s) {
  if (!s || s.trim() === '') return null
  const d = new Date(s.trim())
  return isNaN(d.getTime()) ? null : d.toISOString()
}

// ── Parseur CSV simple ───────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = []
    let current = ''
    let inQuotes = false
    for (let j = 0; j < line.length; j++) {
      const c = line[j]
      if (c === '"') { inQuotes = !inQuotes }
      else if (c === ',' && !inQuotes) { values.push(current); current = '' }
      else { current += c }
    }
    values.push(current)
    const row = {}
    headers.forEach((h, idx) => { row[h] = (values[idx] || '').replace(/^"|"$/g, '').trim() })
    rows.push(row)
  }
  return rows
}

// ── Données gemini (non disponibles sur disque) ──────────────────────────────

const GEMINI_DATA_1 = [
  { title: 'Bourse Mastercard Foundation – Sciences Po', study_level: 'master', category: 'bourse', domain: 'sciences_sociales', country: 'france', funding_type: 'complete', deadline: '2026-01-04', budget_required: '0', short_description: 'Bourse d\'excellence pour les futurs leaders africains.', source_url: 'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/mastercard-foundation-scholarships/graduate-study/', eligibility_summary: 'Nationalité d\'Afrique subsaharienne, moins de 35 ans, leadership.' },
  { title: 'Bourse d\'Excellence Eiffel', study_level: 'master', category: 'bourse', domain: 'tous', country: 'france', funding_type: 'complete', deadline: '2026-01-08', budget_required: '0', short_description: 'Programme de prestige du ministère français des Affaires étrangères.', source_url: 'https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program', eligibility_summary: 'Excellent dossier, 27 ans max pour le Master.' },
  { title: 'Bourses EPOS du DAAD', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-03-15', budget_required: '0', short_description: 'Formation de spécialistes issus de pays en développement en Allemagne.', source_url: 'https://www.daad.de/en/studying-in-germany/scholarships/', eligibility_summary: 'Licence, 2 ans d\'expérience professionnelle minimum.' },
  { title: 'Bourse Chevening (UK Government)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2025-11-04', budget_required: '0', short_description: 'Bourse de leadership pour étudier au Royaume-Uni.', source_url: 'https://www.chevening.org/scholarships/', eligibility_summary: '2 ans d\'expérience pro, potentiel de leadership élevé.' },
  { title: 'Bourse ARES - Masters de spécialisation', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-01-15', budget_required: '0', short_description: 'Formation en Belgique pour des professionnels du développement.', source_url: 'https://www.ares-ac.be/en/international-training-scholarships-2026-2027', eligibility_summary: 'Issu d\'un pays partenaire (Bénin, Burkina, Cameroun, etc.).' },
  { title: 'Bourse Lester B. Pearson (Toronto)', study_level: 'bac', category: 'bourse', domain: 'tous', country: 'canada', funding_type: 'complete', deadline: '2026-01-15', budget_required: '0', short_description: 'Bourse d\'étude complète à l\'Université de Toronto.', source_url: 'https://future.utoronto.ca/scholarships/pearson/', eligibility_summary: 'Étudiant de terminale exceptionnel nominé par son lycée.' },
  { title: 'Bourse Fulbright Foreign Student', study_level: 'master', category: 'bourse', domain: 'tous', country: 'usa', funding_type: 'complete', deadline: '2026-05-15', budget_required: '0', short_description: 'Études de Master ou Doctorat aux USA.', source_url: 'https://foreign.fulbrightonline.org/about/foreign-student-program', eligibility_summary: 'Licence validée, excellent niveau d\'anglais.' },
  { title: 'Bourse Turkiye Burslari', study_level: 'tous', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-02-20', budget_required: '0', short_description: 'Bourse complète incluant langue et logement en Turquie.', source_url: 'https://www.turkiyeburslari.gov.tr', eligibility_summary: 'Âge inférieur à 21 (Bac), 30 (Master) ou 35 (Doc).' },
  { title: 'Bourse MEXT (Gouvernement Japonais)', study_level: 'tous', category: 'bourse', domain: 'tous', country: 'japon', funding_type: 'complete', deadline: '2025-06-30', budget_required: '0', short_description: 'Études au Japon financées par le ministère de l\'éducation.', source_url: 'https://www.studyinjapan.go.jp/en/', eligibility_summary: 'Sélection par test écrit et entretien à l\'ambassade.' },
  { title: 'Bourse d\'Excellence de la Confédération Suisse', study_level: 'doctorat', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2025-11-15', budget_required: '0', short_description: 'Recherche doctorale ou post-doctorale en Suisse.', source_url: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html', eligibility_summary: 'Chercheur diplômé de Master.' },
  { title: 'Bourse d\'Excellence du Gouvernement Hongrois (Stipendium Hungaricum)', study_level: 'tous', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-01-15', budget_required: '0', short_description: 'Programme Stipendium Hungaricum pour études en Hongrie.', source_url: 'https://stipendiumhungaricum.hu', eligibility_summary: 'Pays ayant un accord bilatéral avec la Hongrie.' },
  { title: 'Bourse Emile Boutmy (Sciences Po)', study_level: 'licence', category: 'bourse', domain: 'sciences_sociales', country: 'france', funding_type: 'partielle', deadline: '2025-12-15', budget_required: '0', short_description: 'Aide financière pour les étudiants hors Union Européenne à Sciences Po.', source_url: 'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/', eligibility_summary: 'Admission préalable à Sciences Po Paris.' },
  { title: 'Bourse Intra-Afrique (EACEA)', study_level: 'master', category: 'bourse', domain: 'agriculture', country: 'afrique', funding_type: 'complete', deadline: '2026-05-30', budget_required: '0', short_description: 'Mobilité académique entre universités du continent africain.', source_url: 'https://eacea.ec.europa.eu', eligibility_summary: 'Étudiant inscrit dans une université partenaire en Afrique.' },
  { title: 'Bourses de l\'Université PanAfricaine (UPA)', study_level: 'master', category: 'bourse', domain: 'sciences_tech', country: 'afrique', funding_type: 'complete', deadline: '2025-12-15', budget_required: '0', short_description: 'Bourse d\'excellence de l\'Union Africaine.', source_url: 'https://pau-au.africa/admissions/scholarships', eligibility_summary: 'Citoyen d\'un État membre de l\'UA.' },
  { title: 'Bourse Gates Cambridge', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-01-05', budget_required: '0', short_description: 'Bourse complète pour l\'Université de Cambridge.', source_url: 'https://www.gatescambridge.org', eligibility_summary: 'Candidat hors Royaume-Uni, engagement social.' },
  { title: 'Bourse d\'Exemption UdeM (Montréal)', study_level: 'licence', category: 'bourse', domain: 'tous', country: 'canada', funding_type: 'partielle', deadline: '2026-02-01', budget_required: '0', short_description: 'Réduction massive des frais pour étudiants internationaux.', source_url: 'https://admission.umontreal.ca', eligibility_summary: 'Étudiant étranger admis à l\'UdeM.' },
  { title: 'Bourse d\'Excellence de la Banque Africaine de Développement', study_level: 'master', category: 'bourse', domain: 'commerce', country: 'afrique', funding_type: 'complete', deadline: '2025-12-31', budget_required: '0', short_description: 'Soutien aux étudiants en économie et finance.', source_url: 'https://www.afdb.org/en/about-us/careers/young-professionals-program-ypp', eligibility_summary: 'Excellent dossier académique, nationalité africaine.' },
  { title: 'African Business Heroes (Jack Ma Foundation)', study_level: 'tous', category: 'formation', domain: 'commerce', country: 'afrique', funding_type: 'salariee', deadline: '2026-05-15', budget_required: '0', short_description: 'Concours pour entrepreneurs avec dotation globale de 1,5M$.', source_url: 'https://africabusinessheroes.org', eligibility_summary: 'Fondateur d\'entreprise africaine avec impact.' },
  { title: 'Bourse SBW Berlin', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2025-12-31', budget_required: '0', short_description: 'Bourse pour projets sociaux ou d\'innovation à Berlin.', source_url: 'https://sbw.berlin', eligibility_summary: 'Âgé de 18 à 30 ans, engagement social fort.' },
  { title: 'YALI Regional Leadership Center', study_level: 'tous', category: 'formation', domain: 'social', country: 'afrique', funding_type: 'complete', deadline: '2026-04-15', budget_required: '0', short_description: 'Formation intensive en leadership (Dakar/Accra/Nairobi).', source_url: 'https://yali.state.gov', eligibility_summary: 'Jeune africain 18-35 ans, leader communautaire.' },
  { title: 'Bourse Eiffel Doctorat', study_level: 'doctorat', category: 'bourse', domain: 'tous', country: 'france', funding_type: 'complete', deadline: '2026-01-08', budget_required: '0', short_description: 'Financement de thèse en cotutelle ou codirection.', source_url: 'https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program', eligibility_summary: 'Candidature déposée par l\'université d\'accueil.' },
  { title: 'Bourse du Gouvernement Italien (MAECI)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-06-15', budget_required: '0', short_description: 'Bourses pour étudiants étrangers en Italie.', source_url: 'https://studyinitaly.esteri.it', eligibility_summary: 'Âge inférieur à 28 ans pour le Master.' },
  { title: 'Orange Fab Africa (Accélérateur)', study_level: 'tous', category: 'formation', domain: 'informatique', country: 'afrique', funding_type: 'partielle', deadline: '2026-08-30', budget_required: '0', short_description: 'Accélération de startups tech africaines.', source_url: 'https://orangefab.ci', eligibility_summary: 'Startup avec produit minimum viable (MVP).' },
  { title: 'Bourse DAAD In-Country/In-Region', study_level: 'doctorat', category: 'bourse', domain: 'tous', country: 'afrique', funding_type: 'complete', deadline: '2025-11-30', budget_required: '0', short_description: 'Étudier dans une université africaine hors de son pays.', source_url: 'https://www.daad.de/en/', eligibility_summary: 'Membre du personnel académique ou futur enseignant.' },
  { title: 'Tony Elumelu Foundation Entrepreneurship Programme', study_level: 'tous', category: 'formation', domain: 'commerce', country: 'afrique', funding_type: 'salariee', deadline: '2026-03-31', budget_required: '0', short_description: 'Capital d\'amorçage de 5000$ et formation en ligne pour entrepreneurs africains.', source_url: 'https://www.tonyelumelufoundation.org', eligibility_summary: 'Entrepreneur africain avec un projet de moins de 3 ans.' },
  { title: 'Orange Knowledge Programme (Pays-Bas)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2025-03-31', budget_required: '0', short_description: 'Bourses pour professionnels en milieu de carrière.', source_url: 'https://www.studyinholland.nl/scholarships/highlighted-scholarships/orange-knowledge-programme', eligibility_summary: 'Citoyen d\'un pays éligible (ex: Sénégal, Mali).' },
  { title: 'Bourses d\'Excellence PBEEE (Québec)', study_level: 'doctorat', category: 'bourse', domain: 'sciences_tech', country: 'canada', funding_type: 'complete', deadline: '2025-11-01', budget_required: '0', short_description: 'Bourses de recherche doctorale et postdoctorale.', source_url: 'https://frq.gouv.qc.ca', eligibility_summary: 'Être présélectionné par une université du Québec.' },
  { title: 'Bourse Queen Elizabeth (QES)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'canada', funding_type: 'complete', deadline: '2026-02-15', budget_required: '0', short_description: 'Échanges académiques sur le développement.', source_url: 'https://queenelizabethscholars.ca', eligibility_summary: 'Étudiant chercheur de pays du Commonwealth.' },
  { title: 'Corps des Jeunes Volontaires de l\'UA', study_level: 'tous', category: 'formation', domain: 'social', country: 'afrique', funding_type: 'salariee', deadline: '2026-04-26', budget_required: '0', short_description: 'Volontariat rémunéré au sein de l\'Union Africaine.', source_url: 'https://au.int', eligibility_summary: '18-35 ans, diplôme universitaire requis.' },
  { title: 'Bourse Heinrich Böll Foundation', study_level: 'master', category: 'bourse', domain: 'sciences_sociales', country: 'europe', funding_type: 'complete', deadline: '2026-03-01', budget_required: '0', short_description: 'Bourse pour étudiants engagés politiquement en Allemagne.', source_url: 'https://www.boell.de/en/foundation/scholarship-programme', eligibility_summary: 'Excellent dossier, engagement écologique/social.' },
  { title: 'Bourse de l\'Université de Toronto (Vanier)', study_level: 'doctorat', category: 'bourse', domain: 'tous', country: 'canada', funding_type: 'complete', deadline: '2025-11-01', budget_required: '0', short_description: 'Bourse doctorale de haute renommée (50k$/an).', source_url: 'https://vanier.gc.ca', eligibility_summary: 'Potentiel de leadership et excellence académique.' },
  { title: 'Bourses d\'excellence BOAD', study_level: 'master', category: 'bourse', domain: 'commerce', country: 'afrique', funding_type: 'complete', deadline: '2025-12-31', budget_required: '0', short_description: 'Bourse pour étudiants de l\'espace UEMOA.', source_url: 'https://www.boad.org', eligibility_summary: 'Nationalité d\'un pays membre de l\'UEMOA.' },
  { title: 'Bourse Mauritius Africa Scholarship', study_level: 'licence', category: 'bourse', domain: 'tous', country: 'afrique', funding_type: 'complete', deadline: '2026-04-30', budget_required: '0', short_description: 'Bourse du gouvernement de Maurice pour les africains.', source_url: 'http://ministry-education.govmu.org', eligibility_summary: 'Citoyen d\'un État membre de l\'Union Africaine.' },
  { title: 'L\'Oréal-UNESCO For Women in Science', study_level: 'doctorat', category: 'bourse', domain: 'sciences_tech', country: 'afrique', funding_type: 'salariee', deadline: '2026-03-30', budget_required: '0', short_description: 'Dotation pour les jeunes chercheuses africaines.', source_url: 'https://www.forwomeninscience.com', eligibility_summary: 'Femme chercheuse en Afrique subsaharienne.' },
  { title: 'Bourse de l\'Université de Lausanne (UNIL)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'partielle', deadline: '2025-11-01', budget_required: '0', short_description: 'Bourses de Master pour étudiants étrangers.', source_url: 'https://www.unil.ch/international/en/home/menuguid/finances-et-bourses/bourses-de-l-unil.html', eligibility_summary: 'Diplôme étranger équivalent à la licence.' },
  { title: 'Bourse Learn Africa (Femmes)', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'complete', deadline: '2026-04-15', budget_required: '0', short_description: 'Bourses en Espagne pour femmes africaines.', source_url: 'https://mujeresporafrica.es', eligibility_summary: 'Être une femme de nationalité africaine.' },
  { title: 'UNICEF Venture Fund Innovation Digitale', study_level: 'tous', category: 'formation', domain: 'informatique', country: 'afrique', funding_type: 'partielle', deadline: '2026-02-15', budget_required: '0', short_description: 'Financement pour solutions open-source.', source_url: 'https://www.unicef.org/innovation/venturefund', eligibility_summary: 'Startup tech en pays en développement.' },
  { title: 'Bourses de l\'Université de Genève', study_level: 'master', category: 'bourse', domain: 'tous', country: 'europe', funding_type: 'partielle', deadline: '2026-02-28', budget_required: '0', short_description: 'Bourse d\'excellence pour masters.', source_url: 'https://www.unige.ch/portail/en/university/scholarships/', eligibility_summary: 'Résultats académiques exceptionnels.' },
  { title: 'Bourse de Master de l\'Université de Twente', study_level: 'master', category: 'bourse', domain: 'sciences_tech', country: 'europe', funding_type: 'partielle', deadline: '2026-05-01', budget_required: '0', short_description: 'Bourse pour masters technologiques aux Pays-Bas.', source_url: 'https://www.utwente.nl/en/education/scholarships/', eligibility_summary: 'Être parmi les 5% meilleurs de sa promotion.' },
]

const GEMINI_DATA_2 = [
  { title: 'Prix Pierre Castel – Agri-Entrepreneurs', study_level: 'tous', category: 'formation', domain: 'agriculture', country: 'afrique', funding_type: 'salariee', deadline: '2026-05-30', budget_required: '0', short_description: 'Concours doté de 15 000€ pour soutenir les projets agricoles de jeunes entrepreneurs en Afrique.', source_url: 'https://www.fonds-pierre-castel.org', eligibility_summary: 'Résider au Bénin, Burkina, Cameroun, CI, Madagascar ou RDC. Projet agricole innovant.' },
  { title: 'MEET Africa 2 (Diaspora Entrepreneurship)', study_level: 'tous', category: 'formation', domain: 'commerce', country: 'europe', funding_type: 'partielle', deadline: '2026-12-31', budget_required: '0', short_description: 'Accompagnement et dotation jusqu\'à 10 000€ pour les entrepreneurs de la diaspora africaine résidant en Europe.', source_url: 'https://www.meetafrica.fr', eligibility_summary: 'Membre de la diaspora résidant en Europe avec un projet de création d\'entreprise en Afrique.' },
  { title: 'Yango Fellowship – STEM Africa', study_level: 'licence', category: 'bourse', domain: 'sciences_tech', country: 'afrique', funding_type: 'partielle', deadline: '2026-02-05', budget_required: '0', short_description: 'Soutien aux étudiants en sciences et technologies dans les pays d\'opération de Yango.', source_url: 'https://yango.com', eligibility_summary: 'Étudiants en STIM (STEM) inscrits en 2ème ou 3ème année de licence.' },
  { title: 'Orange Digital Center – Programme Global', study_level: 'bac', category: 'formation', domain: 'informatique', country: 'afrique', funding_type: 'non_financee', deadline: '', budget_required: '0', short_description: 'Programmes gratuits de développement des compétences numériques et accompagnement startup.', source_url: 'https://orangedigitalcenter.sn/', eligibility_summary: 'Jeunes et porteurs de projets ; critères variables selon le programme choisi.' },
  { title: 'Bourse d\'Excellence de la Banque Islamique (IsDB)', study_level: 'tous', category: 'bourse', domain: 'tous', country: 'international', funding_type: 'complete', deadline: '2026-02-28', budget_required: '0', short_description: 'Financement pour étudiants des pays membres de la Banque Islamique de Développement.', source_url: 'https://www.isdb.org/scholarships', eligibility_summary: 'Inscrit dans une université reconnue, ressortissant d\'un pays membre IsDB.' },
  { title: 'Bourse GKS (Global Korea Scholarship)', study_level: 'tous', category: 'bourse', domain: 'tous', country: 'asie', funding_type: 'complete', deadline: '2026-03-15', budget_required: '0', short_description: 'Études complètes en Corée du Sud financées par le gouvernement coréen.', source_url: 'https://www.studyinkorea.go.kr', eligibility_summary: 'Moins de 25 ans (Bac) ou 40 ans (Master/Doc).' },
  { title: 'Prix de l\'Innovation pour l\'Afrique (PIA)', study_level: 'tous', category: 'formation', domain: 'sciences_tech', country: 'afrique', funding_type: 'salariee', deadline: '2026-10-30', budget_required: '0', short_description: 'Récompense les innovations à fort impact social.', source_url: 'https://africaninnovation.org', eligibility_summary: 'Inventeur ou chercheur africain.' },
  { title: 'Bourses d\'Excellence Île-de-France', study_level: 'master', category: 'bourse', domain: 'tous', country: 'france', funding_type: 'partielle', deadline: '2026-03-15', budget_required: '0', short_description: 'Aide à la mobilité pour masters en région parisienne.', source_url: 'https://www.iledefrance.fr/bourses-de-mobilite-internationale', eligibility_summary: 'Premier séjour en France, moins de 30 ans.' },
  { title: 'Fondation de la Schlumberger – Faculty for the Future (Femmes)', study_level: 'doctorat', category: 'bourse', domain: 'sciences_tech', country: 'international', funding_type: 'complete', deadline: '2025-11-05', budget_required: '0', short_description: 'Soutien aux femmes en sciences et technologie dans les pays en développement.', source_url: 'https://www.facultyforthefuture.net', eligibility_summary: 'Femme, pays en développement, doctorat en STEM.' },
  { title: 'Mandela Washington Fellowship', study_level: 'tous', category: 'formation', domain: 'social', country: 'usa', funding_type: 'complete', deadline: '2025-09-15', budget_required: '0', short_description: 'Séjour de 6 semaines aux USA pour jeunes leaders africains.', source_url: 'https://www.irex.org/project/mandela-washington-fellowship-young-african-leaders-initiative', eligibility_summary: 'Jeune leader africain 25-35 ans.' },
]

// ── Lire les fichiers CSV du disque ──────────────────────────────────────────

function readFileRows(filePath, relevantFields) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return parseCSV(content)
  } catch (e) {
    console.warn('Fichier non lisible:', filePath, e.message)
    return []
  }
}

const verifiedRows = readFileRows('/Users/anzoumanacoulibaly/Downloads/kraak-opportunities-verified-real-urls.csv')
const v3Rows = readFileRows('/Users/anzoumanacoulibaly/Downloads/kraak-opportunities-v3-matching-ready-2026-04-22.csv')

// ── Transformer en format unifié ─────────────────────────────────────────────

function normalizeRow(row) {
  return {
    title: cleanText(row.title || row.Title || ''),
    study_level: normalizeStudyLevel(row.study_level || ''),
    category: normalizeCategory(row.category || ''),
    domain: normalizeDomain(row.domain || ''),
    country: normalizeCountry(row.country || row.country_target || ''),
    funding_type: normalizeFundingType(row.funding_type || ''),
    deadline: parseDeadline(row.deadline || ''),
    budget_required: parseInt(row.budget_required || '0') || 0,
    short_description: cleanText(row.short_description || ''),
    source_url: (row.source_url || '').trim() || null,
    eligibility_summary: cleanText(row.eligibility_summary || ''),
  }
}

const allRows = [
  ...verifiedRows.map(normalizeRow),
  ...v3Rows.map(normalizeRow),
  ...GEMINI_DATA_1.map(normalizeRow),
  ...GEMINI_DATA_2.map(normalizeRow),
]

// ── Déduplication par titre (normalise pour comparer) ────────────────────────

function slugify(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim()
}

const seen = new Set()
const unique = []
for (const row of allRows) {
  if (!row.title || row.title.length < 5) continue
  const key = slugify(row.title).slice(0, 50)
  if (!seen.has(key)) {
    seen.add(key)
    unique.push(row)
  }
}

console.log(`Total brut: ${allRows.length} | Après dédup: ${unique.length}`)

// ── Valider les enums avant insertion ────────────────────────────────────────

const VALID_CATEGORIES = ['bourse','formation','programme','stage','emploi']
const VALID_STUDY_LEVELS = ['bac','bac2','bac3','bac5','doctorat','tous']
const VALID_FUNDING = ['complete','partielle','non_financee','salariee']

const valid = unique.filter(r => {
  const ok = r.title &&
    VALID_CATEGORIES.includes(r.category) &&
    VALID_STUDY_LEVELS.includes(r.study_level) &&
    VALID_FUNDING.includes(r.funding_type)
  if (!ok) console.warn('Rejeté:', r.title, `cat=${r.category} sl=${r.study_level} ft=${r.funding_type}`)
  return ok
})

console.log(`Valides pour insertion: ${valid.length}`)

// ── Insérer en base ──────────────────────────────────────────────────────────

async function main() {
  const client = new Client({ connectionString: DB_URL })
  await client.connect()

  // Récupérer les titres existants
  const existing = await client.query('SELECT title FROM opportunities')
  const existingKeys = new Set(existing.rows.map(r => slugify(r.title).slice(0, 50)))

  let inserted = 0, skipped = 0
  for (const row of valid) {
    const key = slugify(row.title).slice(0, 50)
    if (existingKeys.has(key)) { skipped++; continue }

    try {
      await client.query(`
        INSERT INTO opportunities
          (title, study_level, category, domain, country, funding_type,
           deadline, budget_required, short_description, source_url,
           eligibility_summary, is_active, updated_at, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,NOW(),NOW())
      `, [
        row.title, row.study_level, row.category, row.domain,
        row.country, row.funding_type,
        row.deadline, row.budget_required,
        row.short_description, row.source_url, row.eligibility_summary,
      ])
      existingKeys.add(key)
      inserted++
    } catch (e) {
      console.error('Erreur insertion:', row.title, e.message)
    }
  }

  const total = await client.query('SELECT COUNT(*) FROM opportunities')
  console.log(`\nInséré: ${inserted} | Ignoré (déjà existant): ${skipped}`)
  console.log(`Total en base: ${total.rows[0].count}`)

  // Distribution par zone
  const zones = await client.query('SELECT country, COUNT(*) as n FROM opportunities GROUP BY country ORDER BY n DESC')
  console.log('\nDistribution par zone:')
  zones.rows.forEach(r => console.log(`  ${r.country}: ${r.n}`))

  await client.end()
}

main().catch(e => { console.error(e); process.exit(1) })
