import { useEffect } from "react";

const template = (title: string) => `${title} - skied core`;
export function useTitle(title: string, useTemplate = true) {
	useEffect(() => {
		document.title = useTemplate ? template(title) : title;
	}, [title, useTemplate]);
}
