import { useAgent } from "@/app/providers/agent";
import type { ComposerOptionsPostRef, ComposerOptionsQuote } from "@/app/providers/composer";
import { compressImage } from "@/lib/utils/image";
import { getLinkFacets } from "@/lib/utils/link";
import { detectLanguage, jsonToText } from "@/lib/utils/text";
import {
	type AppBskyEmbedExternal,
	type AppBskyEmbedImages,
	type AppBskyEmbedRecord,
	type AppBskyEmbedRecordWithMedia,
	type AppBskyFeedThreadgate,
	AtUri,
	type ComAtprotoLabelDefs,
	RichText,
} from "@atproto/api";
import { useMutation } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/react";
import toast from "react-hot-toast";
import type { ThreadgateSetting } from "../../../../types/feed";

interface Props {
	text: JSONContent;
	linkCard: LinkMeta | null;
	replyTo?: ComposerOptionsPostRef;
	quote?: ComposerOptionsQuote;
	languages: string[];
	images?: UploadImage[];
	tags: string[];
	label: string;
	threadGate: ThreadgateSetting[];
}

export default function usePublishPost(props: Props) {
	const { text, linkCard, replyTo, quote, languages, tags, images, label, threadGate } = props;
	const agent = useAgent();
	const MAX_POST_LENGTH = 300;

	return useMutation({
		mutationKey: ["publishPost"],
		mutationFn: async () => {
			const richText = new RichText({ text: jsonToText(text) });
			const linkFacets = getLinkFacets(text);
			await richText.detectFacets(agent);

			// add link facets if they exist
			if (Array.isArray(richText.facets)) {
				richText.facets = [...richText.facets, ...linkFacets];
			} else {
				richText.facets = [...linkFacets];
			}

			if (richText.graphemeLength > MAX_POST_LENGTH) {
				throw new Error("Post length exceeds the maximum length of 300 characters");
			}

			let lang: string[] = [];

			if (languages.length > 0) {
				lang = languages;
			} else {
				const detectedLanguage = detectLanguage(richText.text);
				lang = detectedLanguage ? [detectedLanguage] : [];
			}

			let selfLabels: ComAtprotoLabelDefs.SelfLabels | undefined;

			if (label) {
				selfLabels = {
					$type: "com.atproto.label.defs#selfLabels",
					values: [label].map((val) => ({ val })),
				};
			}

			let reply;

			if (replyTo) {
				const replyToUrip = new AtUri(replyTo.uri);
				const parentPost = await agent.getPost({
					repo: replyToUrip.host,
					rkey: replyToUrip.rkey,
				});

				if (parentPost) {
					const parentRef = {
						uri: parentPost.uri,
						cid: parentPost.cid,
					};
					reply = {
						root: parentPost.value.reply?.root || parentRef,
						parent: parentRef,
					};
				}
			}

			// embed can be:
			// images
			// record
			// record with media
			// external (link card, record link, pasted images)

			// re-assign embed based on these conditions
			// TODO: add support for pasted images or record links

			let embed:
				| AppBskyEmbedImages.Main
				| AppBskyEmbedRecord.Main
				| AppBskyEmbedRecordWithMedia.Main
				| AppBskyEmbedExternal.Main
				| undefined;

			let embedRecordWithMedia: AppBskyEmbedRecordWithMedia.Main;
			let embedExternal: AppBskyEmbedExternal.Main | undefined;
			const embedImages: AppBskyEmbedImages.Main = {
				$type: "app.bsky.embed.images",
				images: [],
			};

			// has images
			if (images?.length) {
				for (const img of images) {
					try {
						const blob = await compressImage(img);
						const uploaded = await agent.uploadBlob(new Uint8Array(await blob.arrayBuffer()), {
							encoding: blob.type,
						});

						embedImages.images.push({
							image: uploaded.data.blob,
							alt: img.altText || "",
						});
					} catch (e) {
						throw new Error("Failed to upload image");
					}
				}
			}

			// record with media
			if (embedImages.images.length && quote?.uri) {
				embedRecordWithMedia = {
					$type: "app.bsky.embed.recordWithMedia",
					media: embedImages,
					record: {
						$type: "app.bsky.embed.record",
						record: {
							uri: quote.uri,
							cid: quote.cid,
						},
					},
				};
				embed = embedRecordWithMedia;
			}
			// media (images and/or with quote)
			else {
				if (embedImages.images.length) {
					embed = embedImages;
				}

				if (quote?.uri) {
					embed = {
						$type: "app.bsky.embed.record",
						record: {
							uri: quote.uri,
							cid: quote.cid,
						},
					};
				}

				// external (link card, record link, or pasted images) and no images and quote
				if (linkCard && !embedImages.images.length && !quote?.uri) {
					// link card
					if (linkCard.url) {
						embedExternal = {
							$type: "app.bsky.embed.external",
							external: {
								uri: linkCard.url,
								title: linkCard.title || "",
								description: linkCard.description || "",
							},
						};

						// need to upload link card image
						if (linkCard.image) {
							try {
								const image = await fetch(linkCard.image);
								const blob = await compressImage((await image.blob()) as UploadImage);
								const uploaded = await agent.uploadBlob(new Uint8Array(await blob.arrayBuffer()), {
									encoding: blob.type,
								});
								embedExternal.external.thumb = uploaded.data.blob;
							} catch (e) {
								// broken link card image, remove it from post and continue
								linkCard.image = undefined;
							}
						}
						embed = embedExternal;
					}
				}
			}

			if (!embed && richText.graphemeLength === 0) {
				throw new Error("Your post must contain at least some text or image");
			}

			// publish post
			const result = await agent.post({
				createdAt: new Date().toISOString(),
				text: richText.text,
				facets: richText.facets,
				langs: lang,
				tags: tags.length > 0 ? tags : undefined,
				labels: selfLabels,
				reply: reply,
				embed: embed,
			});

			// add threadGate
			if (threadGate.length > 0) {
				const allow: (
					| AppBskyFeedThreadgate.MentionRule
					| AppBskyFeedThreadgate.FollowingRule
					| AppBskyFeedThreadgate.ListRule
				)[] = [];
				if (!threadGate.find((s) => s === "nobody")) {
					for (const rule of threadGate) {
						if (rule === "mention") {
							allow.push({ $type: "app.bsky.feed.threadgate#mentionRule" });
						} else if (rule === "following") {
							allow.push({ $type: "app.bsky.feed.threadgate#followingRule" });
						}
					}
				}

				const submittedPost = new AtUri(result.uri);

				await agent.api.app.bsky.feed.threadgate.create(
					{ repo: agent.session!.did, rkey: submittedPost.rkey },
					{ post: result.uri, createdAt: new Date().toISOString(), allow },
				);
			}
		},
		onSuccess: () => {
			toast.success("Post published", { id: "Post publish" });
		},
		onError: (e) => {
			toast.error(e.message, { id: "Post error" });
		},
	});
}
