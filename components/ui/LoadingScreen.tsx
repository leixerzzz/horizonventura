"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ocean text-white"
      initial={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src="/images/logo.png"
        alt="Horizon Ventura"
        className="w-32 mb-6"
        draggable={false}
        animate={reduceMotion ? undefined : { scale: [1, 1.1, 1] }}
        transition={reduceMotion ? {} : { repeat: Infinity, duration: 1.4 }}
      />

      <motion.div className="w-48 h-2 rounded-full bg-white/20 overflow-hidden">
        <motion.div
          className="h-full bg-sun"
          animate={reduceMotion ? { width: "50%" } : { x: ["-100%", "100%"] }}
          transition={reduceMotion ? undefined : { repeat: Infinity, duration: 1.2 }}
        />
      </motion.div>
    </motion.div>
  );
}
