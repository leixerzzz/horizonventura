"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const destinations = [
  { code: "cu", name: "Cuba", active: true },
  { code: "jm", name: "Jamaica", active: true },
  { code: "tt", name: "Trinidad & Tobago", active: true },
  { code: "ca", name: "Canada", active: true },
  { code: "vn", name: "Vietnam", active: true },
  { code: "gb", name: "England", active: false },
  { code: "de", name: "Germany", active: false }
];

export default function DestinationsSection() {
  const router = useRouter();
  const t = useTranslations("Destinations");
  const reduceMotion = useReducedMotion();

  const title = t?.("title") ?? "Destinations";
  const comingSoon = t?.("comingSoon") ?? "Coming Soon";

  return (
    <section id="destinations" className="py-24 bg-white dark:bg-night text-center" role="region" aria-label={title}>
      <h2 className="text-4xl font-bold mb-12">{title}</h2>

      <div className="flex flex-wrap justify-center gap-10" role="list">
        {destinations.map(dest => {
          const isDisabled = !dest.active;
          return (
            <motion.button
              key={dest.code}
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={() => !isDisabled && router.push(`/destinations/${dest.code}`)}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-lg bg-white dark:bg-white/10 transition-transform
                ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-xl focus:shadow-xl"}`}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              aria-label={isDisabled ? `${dest.name} - ${comingSoon}` : dest.name}
              title={isDisabled ? `${dest.name} — ${comingSoon}` : dest.name}
              role="listitem"
            >
              <img
                src={`/flags/${dest.code}.svg`}
                className="w-12 mb-2"
                alt={`${dest.name} flag`}
                loading="lazy"
                draggable={false}
              />
              <span className="font-semibold">{dest.name}</span>
              {isDisabled && <span className="text-xs mt-1">{comingSoon}</span>}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
