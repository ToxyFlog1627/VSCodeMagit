import {createRoot} from "react-dom/client";
import App from "./App";
import request from "./utils/api";

const response = request("IS_IN_REPO");
document.addEventListener("DOMContentLoaded", async () => {
	const root: Element | null = document.querySelector("#root");
	if (!root) throw new Error("Couldn't mount app - no element matched the selector!");

	window.document.body.style.padding = "0";

	const {data, error} = await response;
	const app = createRoot(root);
	app.render(<App error={!data || error ? "Git hasn't been initialized in this folder!" : undefined} />);
});
