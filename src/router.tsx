import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Login } from "./pages/login";
import { About } from "./pages/about";
import NotFound from "./pages/not-found";
import { Top } from "./pages/Toppage";
export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/"> 
				<Route index />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/about" element={<About />} />
			{/* 仮 */}
			<Route path="/top" element={<Top />} />
			<Route path="*" element={<NotFound />} />
		</>,
	),
);
