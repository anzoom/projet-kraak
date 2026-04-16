import type { CollectionConfig } from "payload"

export const Opportunities: CollectionConfig = {
  slug: "opportunities",
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
      type: "text",
      required: true,
      label: "Pays",
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Catégorie",
      options: [
        { label: "Bourse", value: "bourse" },
        { label: "Formation", value: "formation" },
        { label: "Programme", value: "programme" },
        { label: "Stage", value: "stage" },
        { label: "Emploi", value: "emploi" },
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
        { label: "Partielle", value: "partielle" },
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
