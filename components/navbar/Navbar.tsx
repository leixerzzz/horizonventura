"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { locales as supportedLocales } from "../../lib/i18n";

const meta: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "/flags/us.svg" },
  es: { label: "Español", flag: "/flags/es.svg" },
  fr: { label: "Français", flag: "/flags/fr.svg" },
  it: { label: "Italiano", flag: "/flags/it.svg" },
  de: { label: "Deutsch", flag: "/flags/de.svg" },
  ru: { label: "Русский", flag: "/flags/ru.svg" },
  ja: { label: "日本語", flag: "/flags/jp.svg" },
  zh: { label: "中文", flag: "/flags/cn.svg" },
  hi: { label: "हिन्दी", flag: "/flags/in.svg" },
  ar: { label: "العربية", flag: "/flags/sa.svg" }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const languages = supportedLocales.map((code) => ({
    code,
    label: meta[code]?.label ?? code,
    flag: meta[code]?.flag ?? "/flags/us.svg"
  }));

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const changeLang = (code: string) => {
    if (!pathname) return;
    const parts = pathname.split("/").filter(Boolean); // ['en', 'path', ...] or []
    // replace first segment (locale) or add if missing
    if (parts.length === 0) {
      router.push(`/${code}`);
    } else {
      parts[0] = code;
      router.push("/" + parts.join("/"));
    }
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/40 dark:bg-night/60">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <img src="/images/logo.png" className="h-10" alt="Horizon Ventura logo" />

        <div className="flex gap-8 items-center">
          <a href="#why" className="font-semibold">Why Us</a>
          <a href="#destinations" className="font-semibold">Destinations</a>
          <a href="#contact" className="font-semibold">Contact</a>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={open}
              title="Change language"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 dark:bg-white/10"
            >
              <Globe />
            </button>

            {open && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-3 grid grid-cols-5 gap-3 p-4 rounded-2xl bg-white shadow-xl dark:bg-night"
                role="menu"
                aria-label="Language selector"
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition"
                    title={lang.label}
                    aria-label={`Switch to ${lang.label}`}
                    role="menuitem"
                  >
                    <img src={lang.flag} alt={lang.label} draggable={false} />
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}