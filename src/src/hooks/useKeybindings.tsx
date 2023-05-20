import { useEffect } from 'react';

type Callback = (event: KeyboardEvent) => void;
export type Keybindings = { [key: string]: Callback };

const useKeybindings = (keybindingsOrCallback: Callback | Keybindings) => {
	const isCallback = typeof keybindingsOrCallback === 'function';
	const callback = keybindingsOrCallback as Callback;
	const keybindings = keybindingsOrCallback as Keybindings;

	const onKeyPress = (event: KeyboardEvent) => {
		if (isCallback) return callback(event);
		if (document.activeElement !== document.body && event.key !== 'Escape') return;
		if (!keybindings[event.key]) return;
		keybindings[event.key](event);
		event.preventDefault();
	};

	const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onKeyPress(event);

	useEffect(() => {
		window.addEventListener('keypress', onKeyPress);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keypress', onKeyPress);
			window.removeEventListener('keydown', onKeyDown);
		};
	});
};

export default useKeybindings;
