"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Service = {
  id: string;
  title: string;
  desc: string;
  active: boolean;
  icon: string;
};

const services: Service[] = [
  { id: "itinerary", title: "Custom Itineraries", desc: "Tailored travel plans for every traveler", active: true, icon: "/icons/itinerary.svg" },
  { id: "concierge", title: "24/7 Concierge", desc: "Local support anytime, anywhere", active: true, icon: "/icons/concierge.svg" },
  { id: "resorts", title: "Exclusive Resorts", desc: "Handpicked luxury stays", active: true, icon: "/icons/resort.svg" },
  { id: "excursions", title: "Guided Excursions", desc: "Curated local experiences", active: false, icon: "/icons/excursion.svg" },
  { id: "transport", title: "Private Transport", desc: "Comfortable and reliable transfers", active: true, icon: "/icons/transport.svg" },
  { id: "insurance", title: "Travel Insurance", desc: "Comprehensive coverage options", active: false, icon: "/icons/insurance.svg" }
];

export default function ServicesGrid() {
  const router = useRouter();
  const t = useTranslations?.("Services");
  const reduceMotion = useReducedMotion();

  const sectionTitle = t?.("title") ?? "Services";
  const comingSoon = t?.("comingSoon") ?? "Coming Soon";

  return (
    <section id="services" className="py-16 bg-white dark:bg-night text-center" role="region" aria-label={sectionTitle}>
      <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6" role="list">
        {services.map((svc) => {
          const disabled = !svc.active;
          return (
            <motion.button
              key={svc.id}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={() => !disabled && router.push(`/services/${svc.id}`)}
              className={`flex flex-col items-center gap-3 p-4 rounded-lg bg-white dark:bg-white/5 shadow-sm transition-transform text-left
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md focus:shadow-md"}`}
              disabled={disabled}
              aria-disabled={disabled}
              title={disabled ? `${svc.title} — ${comingSoon}` : svc.title}
              role="listitem"
            >
              <img src={svc.icon} alt={`${svc.title} icon`} className="w-12 h-12" loading="lazy" draggable={false} />
              <div className="w-full">
                <div className="font-semibold">{t?.(`${svc.id}.title`) ?? svc.title}</div>
                <div className="text-sm text-muted-foreground">{t?.(`${svc.id}.desc`) ?? svc.desc}</div>
                {disabled && <div className="text-xs mt-2">{comingSoon}</div>}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
