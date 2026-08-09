import type { Metadata } from "next";
import PropertyLanding from "@/components/PropertyLanding";
import { propertyJsonLd, propertyMetadata, propertyPageByPath } from "@/lib/property-pages";

const page = propertyPageByPath("/sann-thungsao-hostel")!;

export const metadata: Metadata = propertyMetadata(page);

export default function SannThungsaoHostelPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd(page, "Hostel")) }} />
      <PropertyLanding page={page} />
    </>
  );
}
