import { RouterProvider } from "react-router-dom";
import { ComposerProvider } from "./lib/providers/composer";
import QueryProvider from "./lib/providers/query";
import { ScrollProvider } from "./lib/providers/scroll";
import { SessionProvider } from "./lib/providers/session";
import ToastProvider from "./lib/providers/toast";
import { getSession } from "./lib/auth";
import { router } from "./router";

export function App() {
	const session = getSession();
	return (
		<>
			<SessionProvider session={session}>
				<ScrollProvider>
					<QueryProvider>
						<ComposerProvider>
							<RouterProvider router={router} />
						</ComposerProvider>
					</QueryProvider>
					<ToastProvider />
				</ScrollProvider>
			</SessionProvider>
		</>
	);
}
