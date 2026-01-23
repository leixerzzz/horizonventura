```tsx
"use client";

import { createContext, useEffect, useState } from "react";

type Theme = "day" | "night";

type ThemeContextType = {
	theme: Theme;
	setTheme: (t: Theme) => void;
	toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return "day";
		const stored = localStorage.getItem("theme") as Theme | null;
		if (stored) return stored;
		const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
		if (prefersDark) return "night";
		const hour = new Date().getHours();
		return hour >= 18 || hour < 6 ? "night" : "day";
	});

	useEffect(() => {
		try {
			localStorage.setItem("theme", theme);
		} catch {
			// ignore storage errors
		}
		if (theme === "night") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	const toggleTheme = () => setTheme((t) => (t === "day" ? "night" : "day"));

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
```