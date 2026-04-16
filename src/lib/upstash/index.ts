import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error(
        "Upstash Redis non configuré — définir UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN dans .env.local"
      )
    }
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "kraak:ratelimit",
    })
  }
  return ratelimit
}

export async function isRateLimited(identifier: string): Promise<boolean> {
  const { success } = await getRatelimit().limit(identifier)
  return !success
}
