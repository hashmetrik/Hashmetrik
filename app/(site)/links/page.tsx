import { pageMetadata } from "@/lib/seo/metadata";
import { LinksHub } from "@/components/links/links-hub";

export const metadata = pageMetadata({
  title: "Social Profiles & Contact Links",
  description:
    "Every way to reach Hashmetrik in one place: Instagram, LinkedIn, YouTube, Facebook, WhatsApp, phone, email and the studio address.",
  path: "/links",
});

export default function LinksPage() {
  return <LinksHub />;
}
