"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const offers = [
  "Free Snorkeling",
  "Free Tattoo",
  "Free Food Experience",
  "Free City Tour",
  "Free Beach Excursion"
];

export default function OffersPopup() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let timer: number | undefined;
    try {
      const shown = localStorage.getItem("hv-offer-shown");
      if (!shown) {
        timer = window.setTimeout(() => {
          setOpen(true);
          try {
            localStorage.setItem("hv-offer-shown", "true");
          } catch {
            /* ignore storage errors */
          }
        }, 2000);
      }
    } catch {
      // localStorage unavailable — still show popup
      timer = window.setTimeout(() => setOpen(true), 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // focus the first action button
    firstButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const overlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  return (
    <motion.div
      ref={overlayRef}
      onMouseDown={overlayClick}
      className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center"
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      role="presentation"
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offers-title"
        initial={reduceMotion ? undefined : { y: 12, opacity: 0 }}
        animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        <h3 id="offers-title" className="text-2xl font-bold mb-4">Choose your free experience 🎁</h3>

        <div className="grid gap-3">
          {offers.map((offer, i) => (
            <button
              key={i}
              ref={i === 0 ? firstButtonRef : undefined}
              onClick={() => setOpen(false)}
              className="py-3 rounded-xl bg-sun font-semibold hover:scale-105 transition focus:outline-none focus:ring-4 focus:ring-sun/30"
              aria-label={`Select ${offer}`}
            >
              {offer}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-4 text-sm text-gray-600 dark:text-gray-300 underline"
          aria-label="Close offers"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
