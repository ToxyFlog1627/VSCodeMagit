import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const root: Element | null = document.querySelector('#root');
	if (!root) throw new Error("Couldn't mount app - no element matched the selector!");

	const app = createRoot(root);
	app.render(<App />);
});
