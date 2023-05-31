import { useEffect, useRef } from 'react';
import request from '../utils/api';

type Callback = (event: KeyboardEvent) => void;
export type Keybindings = { [key: string]: Callback };

let _id = 0;
let controllingId = -1;

const useKeybindings = (keybindingsOrCallback: Callback | Keybindings, control: boolean = false) => {
	const isCallback = typeof keybindingsOrCallback === 'function';
	const callback = keybindingsOrCallback as Callback;
	const keybindings = keybindingsOrCallback as Keybindings;

	const id = useRef(_id++);

	const canAccess = () => controllingId === -1 || controllingId === id.current;

	const onKeyPress = (event: KeyboardEvent) => {
		if (!canAccess()) return;

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

	useEffect(() => {
		if (!control) return;
		if (!canAccess()) {
			request('showError', "Two useKeybindings can't be controlling simultaneously!");
			return;
		}

		controllingId = id.current;
		return () => {
			controllingId = -1;
		};
	}, []);
};

export default useKeybindings;
