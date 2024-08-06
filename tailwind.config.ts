/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class", // Enable class-based dark mode
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				btn: {
					background: "hsl(var(--btn-background))",
					"background-hover": "hsl(var(--btn-background-hover))",
				},
			},
			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
			},
			gridTemplateColumns: {
				// Custom grid template for auto-fit with minmax
				"auto-fit": "repeat(auto-fit, minmax(150px, 1fr))",
			},
		},
	},
	plugins: [],
};
