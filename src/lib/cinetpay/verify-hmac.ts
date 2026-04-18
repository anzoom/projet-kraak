import { createHmac } from "crypto"

export function verifyCinetPaySignature(
  payload: {
    cpm_site_id: string
    cpm_trans_id: string
    cpm_trans_status: string
    cpm_amount: string
    cpm_currency: string
  },
  signature: string,
  secret: string
): boolean {
  const data =
    payload.cpm_site_id +
    payload.cpm_trans_id +
    payload.cpm_trans_status +
    payload.cpm_amount +
    payload.cpm_currency

  const expected = createHmac("sha256", secret).update(data).digest("hex")

  // Comparaison en temps constant pour éviter les timing attacks
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return diff === 0
}
