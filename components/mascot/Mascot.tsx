"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function Mascot() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState(
    "Hey! Tap anything and I’ll explain it to you 👋"
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mascot-visible");
      if (stored !== null) setVisible(stored === "true");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mascot-visible", String(visible));
    } catch {
      /* ignore */
    }
  }, [visible]);

  const tips = [
    "Click a destination flag to view details.",
    "Use the language globe in the navbar to switch languages.",
    "Tap 'Start Building' to customize your trip.",
    "Open the Services section for add-ons and concierge.",
    "Reserve early for best availability."
  ];

  const onSphereClick = () => {
    const next = tips[Math.floor(Math.random() * tips.length)];
    setMessage(next);
  };

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-6 right-6 bg-sun px-4 py-2 rounded-full shadow-lg"
        aria-label="Show guide"
        title="Show guide"
      >
        Show Guide
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Interactive guide"
      aria-describedby="mascot-message"
      className="fixed bottom-4 right-4 w-64 h-64 bg-white/80 dark:bg-white/10 rounded-3xl shadow-xl p-3"
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-sm"
        aria-label="Close guide"
        title="Close guide"
      >
        ✕
      </button>

      <Canvas camera={{ position: [0, 0, 5] }} style={{ touchAction: "none" }} tabIndex={-1} aria-hidden>
        <ambientLight />
        <Float floatIntensity={reduceMotion ? 0 : 1} rotationIntensity={reduceMotion ? 0 : 1}>
          <mesh onClick={onSphereClick} onPointerDown={onSphereClick} role="button" aria-label="Mascot sphere — click for tips">
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#FF9F1C" />
          </mesh>
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <p id="mascot-message" className="mt-2 text-sm text-center" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
