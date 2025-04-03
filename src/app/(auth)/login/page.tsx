import LoginForm from "@/components/forms/loginForm/LoginForm";

export function Login() {
	return (
		<>
			<main className="relative z-10 min-h-[100svh] flex items-center justify-center animate-fade animate-delay-500 animate-duration-[600ms]">
				<section className="m-3">
					<LoginForm />
				</section>
			</main>
			<img
				src="/images/loginBackground.svg"
				alt="Numerous ouranos logos"
				width={1000}
				height={200}
				className="z-0 fixed bottom-0 w-screen h-[50svh] object-cover animate-fade-up animate-delay-0 animate-duration-[900ms]"
			/>
		</>
	);
}
