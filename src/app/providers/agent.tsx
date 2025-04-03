import { createAgent } from "@/lib/api/bsky/agent";
import { type session, useSession } from "@/lib/auth";
import { isSessionExpired } from "@/lib/utils/session";
import type AtpAgent from "@atproto/api";
import { type ReactNode, createContext, useContext, useEffect } from "react";

const AgentContext = createContext<AtpAgent | null>(null);

interface AgentProviderProps {
	children: ReactNode;
	session: session | null;
}

export const AgentProvider = (props: AgentProviderProps) => {
	const { children, session } = props;

	if (!session) return;
	const agent = createAgent(session.serviceURL ?? "https://bsky.social");
	agent.sessionManager.session = session.session;

	return <AgentContext.Provider value={agent}>{children}</AgentContext.Provider>;
};

export const useAgent = () => {
	const { session, status } = useSession();
	const agent = useContext(AgentContext);

	useEffect(() => {
		if (!session || !agent) return;

		const getSession = async () => {
			if (isSessionExpired(session)) {
				const result = await agent.resumeSession(session);

				if (!result.success) {
					throw new Error("Could not resume session");
				}
			}

			agent.sessionManager.session = session;
		};

		getSession();
	}, [agent, session]);

	if (status !== "authenticated" || !agent /*|| !session?.user*/) {
		throw new Error("AgentProvider must be used inside SessionProvider");
	}

	return agent;
};
