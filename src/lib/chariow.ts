export const CHARIOW_URLS = {
  guide: {
    monthly: process.env.NEXT_PUBLIC_CHARIOW_GUIDE_MONTHLY_URL ?? "",
    annual: process.env.NEXT_PUBLIC_CHARIOW_GUIDE_ANNUAL_URL ?? "",
  },
  coaching: {
    audit: process.env.NEXT_PUBLIC_CHARIOW_COACHING_AUDIT_URL ?? "",
    accompagnement: process.env.NEXT_PUBLIC_CHARIOW_COACHING_ACCOMPAGNEMENT_URL ?? "",
  },
}
