"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Home");

  const title = t?.("hero.title") ?? "Build your dream experience";
  const subtitle = t?.("hero.subtitle") ?? "Travel. Discover. Live unforgettable moments with Horizon Ventura.";
  const cta = t?.("hero.cta") ?? "Start Building";

  return (
    <section
      className="relative h-screen w-full flex items-center justify-center text-white"
      role="region"
      aria-label={t?.("hero.ariaLabel") ?? "Hero"}
    >
      <div className="absolute inset-0 bg-hero-day dark:bg-hero-night bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/30" />

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 40 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl mb-8">
          {subtitle}
        </p>
        <button
          onClick={() => document.getElementById("why")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-4 rounded-full bg-sun text-black font-bold text-lg hover:scale-105 transition focus:outline-none focus:ring-4 focus:ring-sun/30"
          aria-label={cta}
        >
          {cta}
        </button>
      </motion.div>
    </section>
  );
}