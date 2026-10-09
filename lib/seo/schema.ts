import type { MetadataRoute } from "next";
import { AUDIENCES, CONTACT, PILLARS, SERVICES, SITE, SOCIALS } from "../content.ts";
import { safeUrl } from "../url.ts";

export const PUBLIC_PATHS = ["/", "/book", "/contact", "/links", "/insights"] as const;

export function canonicalUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

export type SitemapEntry = {
  slug: string;
  coverUrl: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

/** No invented modification dates: only CMS rows have a reliable lastmod. */
export function buildSitemap(entries: SitemapEntry[]): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = PUBLIC_PATHS.map((path) => ({
    url: canonicalUrl(path),
    ...(path === "/" && {
      images: [...PILLARS, ...SERVICES, ...AUDIENCES].map(({ image }) => canonicalUrl(image)),
    }),
  }));

  return [
    ...pages,
    ...entries.filter((entry) => entry.publishedAt !== null).map((entry) => {
      const cover = safeUrl(entry.coverUrl);
      return {
        url: canonicalUrl(`/insights/${entry.slug}`),
        lastModified: entry.updatedAt,
        ...(cover && { images: [cover] }),
      };
    }),
  ];
}

/** CMS copy must never be able to terminate the JSON-LD script element. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function articleDescription(excerpt: string | null, body: string): string {
  const text = (excerpt?.trim() || body).replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}

export const organizationId = canonicalUrl("/#organization");
export const websiteId = canonicalUrl("/#website");

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": organizationId,
      name: SITE.name,
      url: canonicalUrl("/"),
      description: SITE.description,
      logo: canonicalUrl("/icon-512.png"),
      image: canonicalUrl("/og-image.png"),
      telephone: CONTACT.phone,
      email: CONTACT.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${CONTACT.addressLines[0]}, ${CONTACT.addressLines[1]}`,
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "501505",
        addressCountry: "IN",
      },
      sameAs: SOCIALS.map(({ href }) => href),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "PR and digital marketing services",
        itemListElement: SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.outcomes.join(". "),
            provider: { "@id": organizationId },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE.name,
      url: canonicalUrl("/"),
      description: SITE.description,
      inLanguage: "en-IN",
      publisher: { "@id": organizationId },
    },
  ],
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: canonicalUrl(path),
    })),
  };
}
