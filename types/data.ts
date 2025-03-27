interface EmojiData {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string[];
	unified: string;
}

interface Language {
	code: string;
	name: string;
}

interface UploadImage extends File {
	url: string;
	path?: string;
	altText?: string;
}

enum LikelyType {
	HTML = 0,
	Text = 1,
	Image = 2,
	Video = 3,
	Audio = 4,
	AptData = 5,
	Other = 6,
}

interface LinkMeta {
	error?: string;
	likelyType: LikelyType;
	url: string;
	title?: string;
	description?: string;
	image?: string;
}

type AuditLog = {
	cid: string;
	createdAt: string;
}[];

interface Theme {
	label: string;
	value: string;
}
