"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations?.("Contact");
  const title = t?.("title") ?? "Contact Us";
  const whatsappLabel = t?.("whatsapp") ?? "WhatsApp";
  const emailLabel = t?.("email") ?? "Email";
  const copyLabel = t?.("copy") ?? "Copy Email";
  const copiedLabel = t?.("copied") ?? "Copied!";

  const whatsappNumber = "XXXXXXXXXXX"; // replace with real number, E.164 preferred (e.g. 15551234567)
  const email = "hellohorizonventura@gmail.com";

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-night text-center" role="region" aria-label={title}>
      <h2 className="text-4xl font-bold mb-8">{title}</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          className="px-6 py-4 rounded-xl bg-green-500 text-white font-bold"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${whatsappLabel} ${whatsappNumber}`}
        >
          {whatsappLabel}
        </a>

        <a
          href={`mailto:${email}`}
          className="px-6 py-4 rounded-xl bg-blue-600 text-white font-bold"
          aria-label={`${emailLabel} ${email}`}
        >
          {emailLabel}
        </a>

        <button
          onClick={handleCopy}
          className="px-6 py-4 rounded-xl bg-gray-200 dark:bg-white/10 font-semibold"
          aria-label={copyLabel}
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </section>
  );
}
