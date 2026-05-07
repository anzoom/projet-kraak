import type { Question } from "@/types/test"

export const questions: Question[] = [
  {
    id: "origin_country",
    text: "Tu viens de quel pays ?",
    options: [
      { value: "benin", label: "Bénin" },
      { value: "burkina_faso", label: "Burkina Faso" },
      { value: "cameroun", label: "Cameroun" },
      { value: "cote_ivoire", label: "Côte d'Ivoire" },
      { value: "guinee", label: "Guinée" },
      { value: "mali", label: "Mali" },
      { value: "rdc", label: "RD Congo" },
      { value: "senegal", label: "Sénégal" },
      { value: "togo", label: "Togo" },
      { value: "autre", label: "Autre pays africain" },
    ],
  },
  {
    id: "current_level",
    text: "Tu es en quelle année d'études en ce moment ?",
    options: [
      { value: "lycee", label: "Lycéen (Terminale)" },
      { value: "licence_1_2", label: "Licence 1 ou 2 (Bac+1/+2)" },
      { value: "licence_3", label: "Licence 3 (Bac+3)" },
      { value: "master", label: "Master / Grande École (Bac+4/+5)" },
      { value: "doctorat", label: "Doctorat" },
    ],
  },
  {
    id: "main_objective",
    text: "Quel type d'opportunité tu recherches ?",
    options: [
      { value: "bourse", label: "Obtenir une bourse d'études" },
      { value: "programme", label: "Intégrer un programme (graduate, échange, accélérateur…)" },
      { value: "fellowship", label: "Décrocher un fellowship ou résidence" },
      { value: "concours", label: "Participer à un concours ou compétition" },
      { value: "prix", label: "Remporter un prix ou une dotation" },
      { value: "autre", label: "Autre type d'opportunité" },
    ],
  },
  {
    id: "domain",
    text: "Dans quel domaine tu étudies ou veux étudier ?",
    options: [
      { value: "sciences_tech", label: "Sciences & Technologie / Ingénierie" },
      { value: "commerce", label: "Commerce, Gestion & Finance" },
      { value: "droit_sciences_po", label: "Droit & Sciences politiques" },
      { value: "sante", label: "Santé & Médecine" },
      { value: "sciences_sociales", label: "Sciences sociales & Humanités" },
      { value: "lettres_arts", label: "Arts, Design & Communication" },
      { value: "autre", label: "Autre domaine — je n'ai pas encore décidé" },
    ],
  },
  {
    id: "target_country",
    text: "Tu vises quel pays ou quelle région ?",
    options: [],
  },
  {
    id: "budget",
    text: "Tu peux mettre combien pour financer ton projet ?",
    options: [
      { value: "zero", label: "Zéro budget — je cherche uniquement des opportunités 100% financées" },
      { value: "petit", label: "J'ai un petit budget (moins de 500 000 FCFA / ~800 $)" },
      { value: "moyen", label: "Budget moyen (500 000 à 2 M FCFA / ~800–3 200 $)" },
      { value: "confortable", label: "Budget confortable (plus de 2 M FCFA / +3 200 $)" },
    ],
  },
  {
    id: "academic_level",
    text: "Quel est ton dernier diplôme (obtenu ou en train de valider) ?",
    options: [
      { value: "bac", label: "Baccalauréat (ou équivalent)" },
      { value: "bac2", label: "BTS / DUT / Bac+2" },
      { value: "licence", label: "Licence / Bac+3" },
      { value: "master", label: "Master / Bac+5" },
      { value: "doctorat", label: "Doctorat" },
    ],
  },
  {
    id: "dossier_maturity",
    text: "Ton dossier de candidature, il en est où ?",
    options: [
      { value: "debut", label: "Je commence tout juste — je n'ai rien préparé" },
      { value: "en_cours", label: "J'ai commencé à rassembler mes documents (notes, CV…)" },
      { value: "avance", label: "Mon dossier est presque prêt" },
      { value: "pret", label: "Mon dossier est complet et prêt à envoyer" },
    ],
  },
  {
    id: "main_blocker",
    text: "Qu'est-ce qui t'empêche d'avancer aujourd'hui ?",
    options: [
      { value: "information", label: "Je ne sais pas quelles opportunités existent pour mon profil" },
      { value: "eligibilite", label: "Je ne sais pas si je suis éligible pour ces opportunités" },
      { value: "documents", label: "Je ne sais pas quels documents préparer ni comment" },
      { value: "financement", label: "Je manque de financement pour candidater" },
      { value: "confiance", label: "J'ai besoin d'être guidé — je ne sais pas par où commencer" },
    ],
  },
  {
    id: "timeline",
    text: "Tu voudrais partir ou commencer dans combien de temps ?",
    options: [
      { value: "urgent", label: "Moins de 3 mois — c'est urgent" },
      { value: "court", label: "Dans 3 à 6 mois" },
      { value: "moyen", label: "Dans 6 à 12 mois" },
      { value: "long", label: "Dans plus d'un an" },
    ],
  },
]
