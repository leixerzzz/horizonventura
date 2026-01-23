"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ServicesGrid from "@/components/booking/ServicesGrid";
import Mascot from "@/components/mascot/Mascot";

export default function DestinationPage() {
  const params = useParams();
  const code = params?.code;
  const t = useTranslations?.("Destination");
  const pageTitle = code ? (t?.("title", { code: code.toUpperCase() }) ?? `Build your experience in ${code.toUpperCase()}`) : (t?.("invalidTitle") ?? "Destination");
  const pageDesc = t?.("description") ?? "We help you design unforgettable moments in this destination.";

  if (!code) {
    return (
      <main className="pt-32 px-6 max-w-7xl mx-auto" role="main" aria-label={pageTitle}>
        <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>
        <p className="text-lg text-muted-foreground">Invalid destination code.</p>
      </main>
    );
  }

  return (
    <main className="pt-32 px-6 max-w-7xl mx-auto" role="main" aria-label={pageTitle}>
      <h1 className="text-5xl font-bold mb-4">{pageTitle}</h1>
      <p className="text-xl mb-12">{pageDesc}</p>

      {/* ServicesGrid does not require a destination prop */}
      <ServicesGrid />

      <Mascot />
    </main>
  );
}
