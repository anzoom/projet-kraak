import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next"

const nextConfig: NextConfig = {
  experimental: {
    // Requis par Payload CMS 3
    reactCompiler: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
