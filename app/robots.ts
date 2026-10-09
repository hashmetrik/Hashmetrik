import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    // Preview deployments must not compete with the production site in search.
    // Allow auth forms to be crawled so their noindex directives can be read.
    rules: process.env.VERCEL_ENV === "preview" ? {
      userAgent: "*",
      disallow: "/",
    } : {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/team", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
