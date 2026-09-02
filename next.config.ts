import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A `next dev` and a `next build` in the same checkout both write `.next`, and
  // the dev server wins — which leaves a production build serving 400s for every
  // hashed asset. Setting NEXT_DIST_DIR gives a build its own output directory so
  // the two can run side by side. Vercel and plain `npm run build` are unaffected.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
    // Silence the sass 1.80+ deprecation noise coming from Next's own loader chain.
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
