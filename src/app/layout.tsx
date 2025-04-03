import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
	title: { template: "%s — Ouranos", default: "Ouranos" },
	description: "Your friendly Bluesky client for the web",
	metadataBase: new URL("https://useouranos.app"),
	other: {
		"fc:frame": "vNext",
		"of:version": "vNext",
		"of:accepts:anonymous": "vNext",
		"of:image": "https://useouranos.app/opengraph-image.png",
		"fc:frame:image": "https://useouranos.app/opengraph-image.png",
		"fc:frame:button:1": "Home",
		"fc:frame:button:1:action": "link",
		"fc:frame:button:1:target": "https://useouranos.app",
		"fc:frame:button:2": "About",
		"fc:frame:button:2:action": "link",
		"fc:frame:button:2:target": "https://useouranos.app/about",
		"fc:frame:button:3": "GitHub",
		"fc:frame:button:3:action": "link",
		"fc:frame:button:3:target": "https://github.com/pdelfan/ouranos",
	},
};

// export default async function RootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	const session = await getSessionFromServer();

// 	return (
// 		<html lang="en" className="bg-skin-base">
// 			<head>
// 				{/* for making the page fullscreen on iOS when added to home */}
// 				<meta name="mobile-web-app-capable" content="yes" />
// 			</head>
// 			<body className={inter.className}>
// 				<ThemeProvider>
// 					<SessionProvider session={session}>
// 						<ScrollProvider>
// 							<QueryProvider>
// 								<ComposerProvider>{children}</ComposerProvider>
// 							</QueryProvider>
// 							<ToastProvider />
// 						</ScrollProvider>
// 					</SessionProvider>
// 					<Analytics />
// 					<SpeedInsights />
// 				</ThemeProvider>
// 			</body>
// 		</html>
// 	);
// }
