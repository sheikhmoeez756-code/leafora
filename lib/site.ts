/** Canonical origin, used for metadata, JSON-LD and the sitemap.
 *  Vercel sets VERCEL_PROJECT_PRODUCTION_URL on production deployments. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://plants-eosin.vercel.app";
