import type { Question } from "@/types/test"

export const questions: Question[] = [
  {
    id: "current_level",
    text: "Quel est ton niveau actuel ?",
    options: [
      { value: "lycee", label: "Lycéen (Terminale)" },
      { value: "licence_1_2", label: "Licence 1 ou 2 (Bac+1/+2)" },
      { value: "licence_3", label: "Licence 3 (Bac+3)" },
      { value: "master", label: "Master / Grande École (Bac+4/+5)" },
      { value: "diplome", label: "Diplômé en repositionnement" },
    ],
  },
  {
    id: "main_objective",
    text: "Quel est ton objectif principal ?",
    options: [
      { value: "bourse", label: "Obtenir une bourse d'études" },
      { value: "formation", label: "Intégrer une formation ou école" },
      { value: "echange", label: "Faire un programme d'échange" },
      { value: "stage", label: "Trouver un stage ou une alternance" },
      { value: "emploi", label: "Décrocher un premier emploi" },
    ],
  },
  {
    id: "domain",
    text: "Dans quel domaine veux-tu évoluer ?",
    options: [
      { value: "sciences_tech", label: "Sciences & Technologie / Ingénierie" },
      { value: "commerce", label: "Commerce, Gestion & Finance" },
      { value: "droit_sciences_po", label: "Droit & Sciences politiques" },
      { value: "sante", label: "Santé & Médecine" },
      { value: "sciences_sociales", label: "Sciences sociales & Humanités" },
      { value: "arts_com", label: "Arts, Design & Communication" },
    ],
  },
  {
    id: "target_country",
    text: "Dans quel pays ou région tu voudrais aller ?",
    options: [
      { value: "france", label: "France" },
      { value: "canada", label: "Canada" },
      { value: "usa", label: "États-Unis" },
      { value: "europe", label: "Europe (Allemagne, Belgique, Pays-Bas…)" },
      { value: "afrique", label: "Afrique (hors mon pays)" },
      { value: "peu_importe", label: "Peu importe, je suis ouvert(e)" },
    ],
  },
  {
    id: "budget",
    text: "Quel budget peux-tu mobiliser pour ton projet ?",
    options: [
      { value: "zero", label: "Aucun budget — j'ai besoin d'un financement total" },
      { value: "petit", label: "Moins de 500 000 FCFA (~800 $)" },
      { value: "moyen", label: "Entre 500 000 et 2 000 000 FCFA (~800–3 200 $)" },
      { value: "confortable", label: "Plus de 2 000 000 FCFA (~3 200 $)" },
    ],
  },
  {
    id: "academic_level",
    text: "Quel est ton dernier diplôme obtenu ou en cours ?",
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
    text: "Où en es-tu dans la préparation de ton dossier ?",
    options: [
      { value: "debut", label: "Je n'ai encore rien préparé" },
      { value: "en_cours", label: "J'ai commencé (relevés de notes, CV…)" },
      { value: "avance", label: "Mon dossier est quasiment complet" },
      { value: "pret", label: "Mon dossier est prêt à envoyer" },
    ],
  },
  {
    id: "main_blocker",
    text: "Quel est ton principal blocage aujourd'hui ?",
    options: [
      { value: "information", label: "Je ne sais pas quelles opportunités existent" },
      { value: "eligibilite", label: "Je ne sais pas si je suis éligible" },
      { value: "documents", label: "Je bloque sur les documents à fournir" },
      { value: "financement", label: "Je n'ai pas encore le financement nécessaire" },
      { value: "confiance", label: "Je manque de confiance ou d'accompagnement" },
    ],
  },
  {
    id: "timeline",
    text: "Quel est ton horizon de départ ou de démarrage ?",
    options: [
      { value: "urgent", label: "Moins de 3 mois — c'est urgent" },
      { value: "court", label: "Dans 3 à 6 mois" },
      { value: "moyen", label: "Dans 6 à 12 mois" },
      { value: "long", label: "Dans plus d'un an" },
    ],
  },
  {
    id: "invest_readiness",
    text: "Es-tu prêt(e) à investir un petit montant pour accéder à tes recommandations complètes ?",
    options: [
      { value: "oui_certain", label: "Oui, si ça m'aide vraiment à avancer" },
      { value: "peut_etre", label: "Peut-être, selon ce que je reçois" },
      { value: "non_gratuit", label: "Je préfère un accès gratuit pour l'instant" },
      { value: "non_certain", label: "Non, je ne suis pas prêt(e) à payer" },
    ],
  },
]
