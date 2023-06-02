import { useEffect, useRef } from 'react';

type Callback = (event: KeyboardEvent) => boolean;
export type Keybindings = { [key: string]: (event: KeyboardEvent) => void };

let _id = 0;
const callbacks: { [key: number]: Callback | Keybindings }[] = [];

const onKeyPress = (event: KeyboardEvent) => {
	for (let i = callbacks.length - 1; i >= 0; i--) {
		if (!callbacks[i]) continue;
		for (const [, callback] of Object.entries(callbacks[i])) {
			if (typeof callback === 'function') {
				if (callback(event)) return;
				else continue;
			}

			if (document.activeElement !== document.body && event.key !== 'Escape') continue;

			const keybindings = callback as Keybindings;
			if (!keybindings[event.key]) continue;

			event.preventDefault();
			return keybindings[event.key](event);
		}
	}
};

const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onKeyPress(event);

window.addEventListener('keypress', onKeyPress);
window.addEventListener('keydown', onKeyDown);

const useKeybindings = (callback: Callback | Keybindings, priority: number = 0) => {
	const id = useRef(_id++);

	useEffect(() => {
		console.log(callbacks);
		if (!callbacks[priority]) callbacks[priority] = {};
		callbacks[priority][id.current] = callback;

		return () => {
			delete callbacks[priority][id.current];
		};
	});
};

export default useKeybindings;
