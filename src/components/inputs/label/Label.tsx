interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode;
}

export default function Label(props: Props) {
	const { children, ...rest } = props;
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
		<label {...rest} className="text-md text-skin-secondary font-medium">
			{children}
		</label>
	);
}
