import { RouterProvider } from "react-router-dom";
import { ComposerProvider } from "./app/providers/composer";
import QueryProvider from "./app/providers/query";
import { ScrollProvider } from "./app/providers/scroll";
import { SessionProvider } from "./app/providers/session";
import ToastProvider from "./app/providers/toast";
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
