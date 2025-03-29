// 上書きではなく拡張をするために必要
// https://zenn.dev/qnighy/articles/9c4ce0f1b68350#%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E6%8B%A1%E5%BC%B5
export {};

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id: string;
		handle: string;
		email: string;
		emailConfirmed: boolean;
		service: string;
		bskySession: AtpSessionData;
	}

	interface Session {
		user: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: User;
	}
}
