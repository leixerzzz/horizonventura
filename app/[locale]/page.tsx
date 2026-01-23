"use client";

import React from "react";
import { useTranslations } from "next-intl";
import HeroSection from "@/components/hero/HeroSection";
import DestinationsSection from "@/components/hero/DestinationsSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import OffersPopup from "@/components/offers/OffersPopup";
import Mascot from "@/components/mascot/Mascot";

export default function HomePage() {
  const t = useTranslations("Home");
  const pageLabel = typeof t === "function" ? t("title") || "Horizon Ventura" : "Horizon Ventura";

  return (
    <main id="main" role="main" aria-label={pageLabel} className="min-h-screen bg-white dark:bg-night">
      <OffersPopup />
      <HeroSection />
      <DestinationsSection />
      <ReviewsSection />
      <Mascot />
    </main>
  );
}
