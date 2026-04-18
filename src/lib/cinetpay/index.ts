const CINETPAY_API_URL = "https://api-checkout.cinetpay.com/v2/payment"

export interface CinetPayInitiateParams {
  transactionId: string
  amount: number
  currency: string
  description: string
  returnUrl: string
  notifyUrl: string
}

export async function initiateCinetPayPayment(
  params: CinetPayInitiateParams
): Promise<{ payment_url: string }> {
  const apiKey = process.env.CINETPAY_API_KEY
  const siteId = process.env.CINETPAY_SITE_ID

  if (!apiKey || !siteId) {
    throw new Error("CINETPAY_API_KEY ou CINETPAY_SITE_ID manquant")
  }

  const res = await fetch(CINETPAY_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: apiKey,
      site_id: siteId,
      transaction_id: params.transactionId,
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
      lang: "fr",
      channels: "ALL",
    }),
  })

  if (!res.ok) {
    throw new Error(`CinetPay HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    code: string
    message: string
    data?: { payment_url?: string }
  }

  if (data.code !== "201" || !data.data?.payment_url) {
    throw new Error(`CinetPay erreur: ${data.message}`)
  }

  return { payment_url: data.data.payment_url }
}
