import type { Metadata } from "next";
import PropertyLanding from "@/components/PropertyLanding";
import { propertyJsonLd, propertyMetadata, propertyPageByPath } from "@/lib/property-pages";

const page = propertyPageByPath("/sann-stay-hatyai")!;

export const metadata: Metadata = propertyMetadata(page);

export default function SannStayHatyaiPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(page, "Hotel")) }} />
      <PropertyLanding page={page} />
    </>
  );
}
