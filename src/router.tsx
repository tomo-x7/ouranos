import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Login } from "./app/(auth)/login/page";
import { About } from "./app/(site)/about/page";
import NotFound from "./app/not-found";
import { Home } from "./app/page";
export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/dashboard"> </Route>
			<Route path="/login" element={<Login />} />
			<Route path="/about" element={<About />} />
			<Route path="/" element={<Home />} />
			<Route path="*" element={<NotFound />} />
		</>,
	),
);
