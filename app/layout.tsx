import { ThemeProvider } from "@/context/theme_context";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "New Tab",
	description: "Google Home Plus New Tab",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-background text-foreground">
				<ThemeProvider>
					<main className="min-h-screen flex flex-col items-center">
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
