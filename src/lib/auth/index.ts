import type { AtpSessionData } from "@atproto/api";
import { createContext, useContext } from "react";

export type session =
	| {
			status: "authenticated";
			session: AtpSessionData;
			serviceURL: string;
	  }
	| {
			status: "unauthenticated";
			session?: undefined;
			serviceURL?: undefined;
	  };
interface SignInResponse {
	error: string | null;
	ok: boolean;
}
export const context = createContext<session>({ status: "unauthenticated" });
export function useSession() {
	return useContext(context);
}
export function getSession(): session {
	return { status: "unauthenticated" };
}
export async function signIn({ handle, password }: { handle: string; password: string }): Promise<SignInResponse> {
	return { error: "", ok: false };
}
export async function signOut() {}
export async function getService(handle: string): Promise<string> {
	return "";
}
