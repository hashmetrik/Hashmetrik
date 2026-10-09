import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import { canonicalUrl } from "./schema";

/** Nested metadata is replaced by Next, so every page supplies a complete card. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  article,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: string | null;
  article?: { publishedTime?: string; modifiedTime: string };
}): Metadata {
  const displayTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  const images = image
    ? [{ url: image, alt: title }]
    : [{ url: canonicalUrl("/og-image.png"), width: 1200, height: 630, alt: SITE.tagline }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      type: article ? "article" : "website",
      title: displayTitle,
      description,
      url: canonicalUrl(path),
      siteName: SITE.name,
      locale: "en_IN",
      images,
      ...article,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images,
    },
  };
}
