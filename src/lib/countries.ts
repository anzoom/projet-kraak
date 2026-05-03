export interface CountryMeta {
  label: string
  zone: string
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

// Specific countries → their zone
export const SPECIFIC_COUNTRIES: Record<string, CountryMeta> = {
  // Europe
  france:     { label: "France",       zone: "europe" },
  belgique:   { label: "Belgique",     zone: "europe" },
  suisse:     { label: "Suisse",       zone: "europe" },
  allemagne:  { label: "Allemagne",    zone: "europe" },
  royaume_uni:{ label: "Royaume-Uni",  zone: "europe" },
  espagne:    { label: "Espagne",      zone: "europe" },
  portugal:   { label: "Portugal",     zone: "europe" },
  pays_bas:   { label: "Pays-Bas",     zone: "europe" },
  italie:     { label: "Italie",       zone: "europe" },
  danemark:   { label: "Danemark",     zone: "europe" },
  suede:      { label: "Suède",        zone: "europe" },
  // Amérique du Nord
  canada:     { label: "Canada",       zone: "amerique_nord" },
  etats_unis: { label: "États-Unis",   zone: "amerique_nord" },
  // Afrique
  maroc:      { label: "Maroc",        zone: "afrique" },
  senegal:    { label: "Sénégal",      zone: "afrique" },
  cote_ivoire:{ label: "Côte d'Ivoire",zone: "afrique" },
  cameroun:   { label: "Cameroun",     zone: "afrique" },
  tunisie:    { label: "Tunisie",      zone: "afrique" },
  // Asie
  chine:      { label: "Chine",        zone: "asie" },
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
