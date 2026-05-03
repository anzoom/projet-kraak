export type Article = "la" | "le" | "les" | "l'"

export interface CountryMeta {
  label: string
  zone: string
  article: Article
}

export const ZONE_LABELS: Record<string, string> = {
  europe: "Europe",
  afrique: "Afrique",
  amerique_nord: "Amérique du Nord",
  amerique_sud: "Amérique du Sud",
  asie: "Asie",
  moyen_orient: "Moyen-Orient",
  oceanie: "Océanie",
  international: "International / Mondial",
}

export const ZONE_ARTICLES: Record<string, Article> = {
  europe:       "l'",
  afrique:      "l'",
  amerique_nord:"l'",
  amerique_sud: "l'",
  asie:         "l'",
  moyen_orient: "le",
  oceanie:      "l'",
}

// Specific countries → their zone
export const SPECIFIC_COUNTRIES: Record<string, CountryMeta> = {
  // Europe
  france:     { label: "France",        zone: "europe",        article: "la"  },
  belgique:   { label: "Belgique",      zone: "europe",        article: "la"  },
  suisse:     { label: "Suisse",        zone: "europe",        article: "la"  },
  allemagne:  { label: "Allemagne",     zone: "europe",        article: "l'"  },
  royaume_uni:{ label: "Royaume-Uni",   zone: "europe",        article: "le"  },
  espagne:    { label: "Espagne",       zone: "europe",        article: "l'"  },
  portugal:   { label: "Portugal",      zone: "europe",        article: "le"  },
  pays_bas:   { label: "Pays-Bas",      zone: "europe",        article: "les" },
  italie:     { label: "Italie",        zone: "europe",        article: "l'"  },
  danemark:   { label: "Danemark",      zone: "europe",        article: "le"  },
  suede:      { label: "Suède",         zone: "europe",        article: "la"  },
  // Amérique du Nord
  canada:     { label: "Canada",        zone: "amerique_nord", article: "le"  },
  etats_unis: { label: "États-Unis",    zone: "amerique_nord", article: "les" },
  // Afrique
  maroc:      { label: "Maroc",         zone: "afrique",       article: "le"  },
  senegal:    { label: "Sénégal",       zone: "afrique",       article: "le"  },
  cote_ivoire:{ label: "Côte d'Ivoire", zone: "afrique",       article: "la"  },
  cameroun:   { label: "Cameroun",      zone: "afrique",       article: "le"  },
  tunisie:    { label: "Tunisie",       zone: "afrique",       article: "la"  },
  // Asie
  chine:      { label: "Chine",         zone: "asie",          article: "la"  },
}

/** "l'Europe", "la France", "le Canada", "les Pays-Bas" */
export function withArticle(article: Article, label: string): string {
  return article === "l'" ? `l'${label}` : `${article} ${label}`
}

/** "à l'Europe", "à la France", "au Canada", "aux Pays-Bas" */
export function withA(article: Article, label: string): string {
  if (article === "l'") return `à l'${label}`
  if (article === "le")  return `au ${label}`
  if (article === "les") return `aux ${label}`
  return `à la ${label}`
}

/** "toute l'Europe", "toute la France", "tout le Canada", "tous les Pays-Bas" */
export function toute(article: Article, label: string): string {
  if (article === "l'") return `toute l'${label}`
  if (article === "le")  return `tout le ${label}`
  if (article === "les") return `tous les ${label}`
  return `toute la ${label}`
}

export function getZoneForCountry(country: string): string | undefined {
  return SPECIFIC_COUNTRIES[country]?.zone
}

export function isSpecificCountry(value: string): boolean {
  return value in SPECIFIC_COUNTRIES
}

// Grouped structure for the UI selector
export const COUNTRY_GROUPS: Array<{
  zoneValue: string
  zoneLabel: string
  countries: Array<{ value: string; label: string }>
}> = [
  {
    zoneValue: "europe",
    zoneLabel: "Europe",
    countries: [
      { value: "france",      label: "France" },
      { value: "belgique",    label: "Belgique" },
      { value: "suisse",      label: "Suisse" },
      { value: "allemagne",   label: "Allemagne" },
      { value: "royaume_uni", label: "Royaume-Uni" },
      { value: "espagne",     label: "Espagne" },
      { value: "portugal",    label: "Portugal" },
      { value: "pays_bas",    label: "Pays-Bas" },
      { value: "italie",      label: "Italie" },
      { value: "danemark",    label: "Danemark" },
      { value: "suede",       label: "Suède" },
    ],
  },
  {
    zoneValue: "amerique_nord",
    zoneLabel: "Amérique du Nord",
    countries: [
      { value: "canada",     label: "Canada" },
      { value: "etats_unis", label: "États-Unis" },
    ],
  },
  {
    zoneValue: "afrique",
    zoneLabel: "Afrique",
    countries: [
      { value: "maroc",       label: "Maroc" },
      { value: "senegal",     label: "Sénégal" },
      { value: "cote_ivoire", label: "Côte d'Ivoire" },
      { value: "cameroun",    label: "Cameroun" },
      { value: "tunisie",     label: "Tunisie" },
    ],
  },
  {
    zoneValue: "asie",
    zoneLabel: "Asie",
    countries: [
      { value: "chine", label: "Chine" },
    ],
  },
]
