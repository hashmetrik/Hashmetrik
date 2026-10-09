import { Hero } from "@/components/home/hero";
import { GrowthPackage } from "@/components/home/growth-package";
import { Audiences } from "@/components/home/audiences";
import { Services } from "@/components/home/services";
import { Why } from "@/components/home/why";
import { Faq } from "@/components/home/faq";
import { ContactBand } from "@/components/home/contact-band";
import { SectionScroll } from "@/components/site/section-link";
import { FAQS, SITE } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "PR & Digital Marketing Agency in Hyderabad | Hashmetrik",
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
});

/* Matches the visible questions. FAQ rich results are restricted by Google;
   this describes the content without promising that search presentation. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      {/* Picks up a section chosen from another page, so those links land on
          the section without carrying a fragment into the URL. */}
      <SectionScroll />
      <Hero />
      {/* The package is the homepage's argument, so it comes before the
          breakdown of what is in it: one purchase, then its parts. */}
      <GrowthPackage />
      <Services />
      <Audiences />
      <Why />
      <Faq />
      <ContactBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
    </>
  );
}
