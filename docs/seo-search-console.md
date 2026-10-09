# SEO and Google Search Console

The production URL is **https://www.hashmetrik.in**. The bare domain already
redirects to `www`; keep that permanent redirect configured in Vercel. `SITE.url`
in `lib/content.ts` is the source for canonical URLs, sitemap URLs and structured
data. Do not replace it with a preview deployment URL.

## Files served by the app

| URL | Purpose |
| --- | --- |
| https://www.hashmetrik.in/sitemap.xml | All five public pages and every published CMS entry, plus image sitemap entries. |
| https://www.hashmetrik.in/robots.txt | Crawl rules and the absolute sitemap location. |
| https://www.hashmetrik.in/og-image.png | The 1200 × 630 social sharing image. |

Next.js generates the XML and robots text from `app/sitemap.ts` and
`app/robots.ts`. Do not upload competing copies to `public/`. One sitemap is
sufficient for this site's size; its image entries share the same XML file.

The sitemap reads the CMS at request time, so publishing or removing an article
updates the next sitemap request without a rebuild. Drafts and private areas are
excluded. CMS `updatedAt` supplies article modification dates; static pages omit
`lastmod` because a crawl or build date is not a content edit date. If the database
is temporarily unreachable, the fixed public pages remain available and article
discovery resumes on the next successful request.

Public pages have unique titles, descriptions, canonical URLs and Open Graph and
Twitter cards. The site describes its real business, services and website with
JSON-LD; articles also describe their author, publication/edit dates and
breadcrumbs. FAQ markup matches the homepage's visible answers and does not
guarantee an FAQ rich result.

Login, signup, suspended accounts, dashboards, staff, admin and API routes send
`noindex` signals. Authentication and database authorization still control access.
Auth forms remain crawlable so crawlers can read their `noindex`. Vercel previews
send `X-Robots-Tag: noindex, nofollow`, use noindex page metadata and disallow
crawling in their robots file.

## Submit after the production deployment

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add a **Domain** property for `hashmetrik.in` and verify the DNS TXT record
   Google provides. This covers HTTPS, HTTP, `www` and the bare domain.
3. Alternatively, add a **URL prefix** property for `https://www.hashmetrik.in/`.
   For HTML-tag verification, put only Google's `content` value into the Vercel
   production environment variable `GOOGLE_SITE_VERIFICATION`, then redeploy.
   The app renders the verification meta tag. DNS verification needs no app token.
4. Open the production sitemap and robots URLs above. Confirm they return HTTP
   200 and contain `https://www.hashmetrik.in`, not the former `.com` domain.
5. In **Sitemaps**, submit `https://www.hashmetrik.in/sitemap.xml` (or `sitemap.xml`
   when Search Console already displays the URL prefix).
6. Use **URL inspection → Test live URL** for the homepage, `/contact`, `/book`,
   `/insights` and a published article. Confirm the declared canonical and request
   indexing for the pages you want discovered first.
7. Review **Page indexing** and the sitemap status after Google recrawls. Validate
   live structured data with the [Rich Results Test](https://search.google.com/test/rich-results)
   or [Schema Markup Validator](https://validator.schema.org/).

A Git push must be deployed before Google can see the new files. Submission
helps discovery; Google decides whether and when to index pages.
