import { useEffect } from 'react';

export type Keybindings = { [key: string]: (event: KeyboardEvent) => any };

const useKeybindings = (keybindings: Keybindings) => {
	const callback = (event: KeyboardEvent) => {
		if (!keybindings[event.key]) return;
		keybindings[event.key](event);
		event.preventDefault();
	};

	useEffect(() => {
		window.addEventListener('keypress', callback);
		return () => window.removeEventListener('keypress', callback);
	});
};

export default useKeybindings;
