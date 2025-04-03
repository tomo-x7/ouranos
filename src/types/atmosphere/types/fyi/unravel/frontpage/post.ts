/**
 * GENERATED CODE - DO NOT MODIFY
 */
import type { ValidationResult } from "@atproto/lexicon";
import { lexicons } from "../../../../lexicons";
import { hasProp, isObj } from "../../../../util";

export interface Record {
	/** The title of the post. */
	title: string;
	/** The URL of the post. */
	url: string;
	/** Client-declared timestamp when this post was originally created. */
	createdAt: string;
	[k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
	return (
		isObj(v) &&
		hasProp(v, "$type") &&
		(v.$type === "fyi.unravel.frontpage.post#main" || v.$type === "fyi.unravel.frontpage.post")
	);
}

export function validateRecord(v: unknown): ValidationResult {
	return lexicons.validate("fyi.unravel.frontpage.post#main", v);
}
