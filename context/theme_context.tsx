"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

interface ThemeContextType {
	theme: string | null;
	setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const [theme, setTheme] = useState<string | null>(null);

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			setTheme(storedTheme);
			applyTheme(storedTheme);
		} else {
			applyTheme("system");
		}
	}, []);

	const applyTheme = (theme: string) => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
			root.classList.remove("light");
		} else if (theme === "light") {
			root.classList.add("light");
			root.classList.remove("dark");
		} else {
			root.classList.remove("dark");
			root.classList.remove("light");
			if (
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				root.classList.add("dark");
			} else {
				root.classList.add("light");
			}
		}
	};

	const changeTheme = (newTheme: string) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		applyTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
