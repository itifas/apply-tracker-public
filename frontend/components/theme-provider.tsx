"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
	defaultPaletteId,
	PALETTE_STORAGE_KEY,
	isPaletteId,
	type PaletteId,
} from "@/lib/theme-palettes";

type PaletteContextValue = {
	palette: PaletteId;
	setPalette: (palette: PaletteId) => void;
	mounted: boolean;
};

const PaletteContext = React.createContext<PaletteContextValue | null>(null);

function applyPalette(palette: PaletteId) {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.dataset.palette = palette;
}

export function usePalette() {
	const context = React.useContext(PaletteContext);

	if (!context) {
		throw new Error("usePalette must be used within ThemeProvider");
	}

	return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [palette, setPaletteState] =
		React.useState<PaletteId>(defaultPaletteId);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);
		const nextPalette = isPaletteId(storedPalette)
			? storedPalette
			: defaultPaletteId;

		setPaletteState(nextPalette);
		setMounted(true);
	}, []);

	React.useEffect(() => {
		if (!mounted) {
			return;
		}

		applyPalette(palette);
		window.localStorage.setItem(PALETTE_STORAGE_KEY, palette);
	}, [mounted, palette]);

	const setPalette = React.useCallback((nextPalette: PaletteId) => {
		setPaletteState(nextPalette);
		applyPalette(nextPalette);
		window.localStorage.setItem(PALETTE_STORAGE_KEY, nextPalette);
	}, []);

	return (
		<PaletteContext.Provider value={{ palette, setPalette, mounted }}>
			<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</NextThemesProvider>
		</PaletteContext.Provider>
	);
}
