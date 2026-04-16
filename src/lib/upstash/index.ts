import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Rate limiter Upstash — protège les endpoints auth et paiement
 * contre le brute force
 *
 * Fenêtre glissante : 10 requêtes / 60 secondes par IP
 */
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "kraak:ratelimit",
})

/**
 * Vérifie le rate limit pour une IP donnée.
 * Retourne true si la requête doit être bloquée (limite atteinte).
 */
export async function isRateLimited(identifier: string): Promise<boolean> {
  const { success } = await ratelimit.limit(identifier)
  return !success
}
