import { getSession } from "@/lib/auth";
import { isSessionExpired } from "@/lib/utils/session";
import { AtpAgent } from "@atproto/api";

export const createAgent = (service: string) => {
	return new AtpAgent({
		service,
	});
};

export const getBskySession = async () => {
	try {
		const session = getSession();

		if (!session.session) {
			throw new Error("No session found");
		}

		const agent = createAgent(session.serviceURL);

		if (isSessionExpired(session.session)) {
			const result = await agent.resumeSession(session.session);

			if (!result.success) {
				throw new Error("Could not resume session");
			}
		}

		// session is not expired, use the current one
		agent.sessionManager.session = session.session;

		return agent;
	} catch (e) {
		throw new Error("Could not get session");
	}
};

// export const getAgentFromServer = async () => {
// 	try {
// 		const agent = await getBskySession();
// 		return agent;
// 	} catch (error) {
// 		console.error(error);
// 		redirect("/");
// 	}
// };
