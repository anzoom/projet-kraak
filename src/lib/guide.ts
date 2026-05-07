import { prisma } from "@/lib/prisma"

export function extractPreview(source: string, paragraphs = 3): string {
  const blocks = source.split(/\n\n+/)
  const preview: string[] = []
  let count = 0

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    preview.push(trimmed)
    // Count non-heading blocks as paragraphs
    if (!trimmed.startsWith("#")) {
      count++
      if (count >= paragraphs) break
    }
  }

  return preview.join("\n\n")
}

// Phase MVP : accès guide fermé — on collecte l'intérêt, pas encore l'accès
export async function hasGuideAccess(_dbUserId: string): Promise<boolean> {
  return false
}
