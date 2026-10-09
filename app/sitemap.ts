import type { MetadataRoute } from "next";
import { listPublished } from "@/lib/cms/store";
import { buildSitemap } from "@/lib/seo/schema";

// Read published content on each request, including after a database recovery.
// The default metadata-route cache otherwise freezes this at deployment time.
export const dynamic = "force-dynamic";

/**
 * The static pages, plus whatever the CMS has published.
 *
 * A database failure here must not take the sitemap down — a crawler that gets
 * a 500 drops the whole file, and the fixed public pages are the ones that matter
 * most.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Every published CMS type can render at /insights/[slug], even if it is not
  // a blog post or a case study featured in the insights listing.
  const entries = await listPublished().catch(() => []);
  return buildSitemap(entries);
}
