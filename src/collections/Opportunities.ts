import type { CollectionConfig } from "payload"

export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "country", "category", "is_active", "deadline"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "country",
      type: "select",
      required: true,
      label: "Pays / Zone géographique",
      options: [
        // International
        { label: "International / Mondial", value: "international" },
        // Europe — pays spécifiques
        { label: "France",       value: "france" },
        { label: "Belgique",     value: "belgique" },
        { label: "Suisse",       value: "suisse" },
        { label: "Allemagne",    value: "allemagne" },
        { label: "Royaume-Uni",  value: "royaume_uni" },
        { label: "Espagne",      value: "espagne" },
        { label: "Portugal",     value: "portugal" },
        { label: "Pays-Bas",     value: "pays_bas" },
        { label: "Italie",       value: "italie" },
        { label: "Danemark",     value: "danemark" },
        { label: "Suède",        value: "suede" },
        { label: "Europe (toute zone)", value: "europe" },
        // Amérique du Nord
        { label: "Canada",       value: "canada" },
        { label: "États-Unis",   value: "etats_unis" },
        { label: "Amérique du Nord (toute zone)", value: "amerique_nord" },
        { label: "Amérique du Sud", value: "amerique_sud" },
        // Afrique — pays spécifiques
        { label: "Maroc",        value: "maroc" },
        { label: "Sénégal",      value: "senegal" },
        { label: "Côte d'Ivoire",value: "cote_ivoire" },
        { label: "Cameroun",     value: "cameroun" },
        { label: "Tunisie",      value: "tunisie" },
        { label: "Afrique (toute zone)", value: "afrique" },
        // Asie
        { label: "Chine",        value: "chine" },
        { label: "Asie (toute zone)", value: "asie" },
        // Autres zones
        { label: "Moyen-Orient", value: "moyen_orient" },
        { label: "Océanie",      value: "oceanie" },
      ],
    },
    {
      name: "location",
      type: "text",
      label: "Pays / Lieu (optionnel)",
      admin: {
        description: "Ex : France, USA / Canada, Cameroun — laisse vide si international ou non précisé.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Catégorie",
      options: [
        { label: "Bourse", value: "bourse" },
        { label: "Programme", value: "programme" },
        { label: "Fellowship", value: "fellowship" },
        { label: "Concours", value: "concours" },
        { label: "Prix", value: "prix" },
        { label: "Autre", value: "autre" },
      ],
    },
    {
      name: "study_level",
      type: "select",
      required: true,
      label: "Niveau d'étude",
      options: [
        { label: "Bac", value: "bac" },
        { label: "Bac+2", value: "bac2" },
        { label: "Bac+3 / Licence", value: "bac3" },
        { label: "Bac+5 / Master", value: "bac5" },
        { label: "Doctorat", value: "doctorat" },
        { label: "Tous niveaux", value: "tous" },
      ],
    },
    {
      name: "domain",
      type: "text",
      required: true,
      label: "Domaine",
    },
    {
      name: "funding_type",
      type: "select",
      label: "Type de financement",
      options: [
        { label: "Complète", value: "complete" },
        { label: "Partielle", value: "partial" },
        { label: "Non financée", value: "non_financee" },
        { label: "Salariée", value: "salariee" },
      ],
    },
    {
      name: "budget_required",
      type: "number",
      label: "Budget requis (XOF)",
    },
    {
      name: "deadline",
      type: "date",
      label: "Date limite",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "competitiveness_level",
      type: "select",
      label: "Niveau de compétitivité",
      options: [
        { label: "Faible", value: "faible" },
        { label: "Moyen", value: "moyen" },
        { label: "Élevé", value: "eleve" },
        { label: "Très élevé", value: "tres_eleve" },
      ],
    },
    {
      name: "eligibility_summary",
      type: "textarea",
      label: "Résumé éligibilité",
    },
    {
      name: "source_url",
      type: "text",
      label: "URL source",
    },
    {
      name: "short_description",
      type: "textarea",
      required: true,
      label: "Description courte",
    },
    {
      name: "is_active",
      type: "checkbox",
      defaultValue: true,
      label: "Active",
      admin: {
        description: "Décocher pour dépublier immédiatement cette opportunité.",
      },
    },
  ],
  timestamps: true,
}
