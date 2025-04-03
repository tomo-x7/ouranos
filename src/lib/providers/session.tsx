import { context, type session } from "@/lib/auth";

export function SessionProvider({ children, session }: { children: React.ReactNode; session: session }) {
	return <context.Provider value={session}>{children}</context.Provider>;
}
