import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { articleDescription, breadcrumbSchema, buildSitemap, canonicalUrl, serializeJsonLd, siteSchema } from "../lib/seo/schema.ts";

describe("SEO discovery", () => {
  it("uses the live canonical domain and includes insights even before publication", () => {
    const pages = buildSitemap([]);
    assert.deepEqual(pages.map(({ url }) => url), [
      "https://www.hashmetrik.in/",
      "https://www.hashmetrik.in/book",
      "https://www.hashmetrik.in/contact",
      "https://www.hashmetrik.in/links",
      "https://www.hashmetrik.in/insights",
    ]);
    assert.ok(pages.every((page) => page.lastModified === undefined));
    assert.ok(pages[0].images?.every((url) => new URL(url).origin === "https://www.hashmetrik.in"));
    assert.ok((pages[0].images?.length ?? 0) > 0);
  });

  it("includes published pieces with their actual edit dates and excludes drafts", () => {
    const publishedAt = new Date("2026-08-01T00:00:00Z");
    const updatedAt = new Date("2026-08-20T00:00:00Z");
    const entries = buildSitemap([
      { slug: "seo-guide", publishedAt, updatedAt, coverUrl: "https://images.example.com/seo.jpg" },
      { slug: "draft", publishedAt: null, updatedAt, coverUrl: null },
    ]);
    assert.equal(entries.length, 6);
    assert.deepEqual(entries[5], {
      url: "https://www.hashmetrik.in/insights/seo-guide",
      lastModified: updatedAt,
      images: ["https://images.example.com/seo.jpg"],
    });
  });

  it("does not publish unsafe legacy cover URLs", () => {
    const pages = buildSitemap([{
      slug: "guide", publishedAt: new Date(), updatedAt: new Date(),
      coverUrl: "javascript:alert(1)",
    }]);
    assert.equal(pages[5].images, undefined);
  });

  it("keeps CMS text inside the JSON-LD script while preserving its content", () => {
    const data = { headline: "</script><script>alert('cms')</script> & SEO" };
    const serialized = serializeJsonLd(data);
    assert.ok(!serialized.includes("<"));
    assert.deepEqual(JSON.parse(serialized), data);
  });

  it("provides a description when the editor leaves the excerpt blank", () => {
    assert.equal(articleDescription(null, "A useful\n\narticle about SEO."), "A useful article about SEO.");
    assert.equal(articleDescription("  The excerpt.  ", "Ignored body"), "The excerpt.");
    assert.ok(articleDescription(null, "Useful article text. ".repeat(50)).length <= 160);
  });

  it("connects organization and website data using stable canonical identifiers", () => {
    const [organization, website] = siteSchema["@graph"];
    assert.equal(organization.url, canonicalUrl("/"));
    assert.equal(website.publisher?.["@id"], organization["@id"]);
    const breadcrumb = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
    ]);
    assert.equal(breadcrumb.itemListElement[1].item, canonicalUrl("/insights"));
    assert.equal(breadcrumb.itemListElement[1].position, 2);
  });
});
