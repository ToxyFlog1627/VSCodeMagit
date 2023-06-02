import { FunctionComponent } from 'react';
import styled from 'styled-components';
import useKeybindings from '../../hooks/useKeybindings';
import request from '../../utils/api';
import Popup from './Popup';

const KEYS = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789';

type PopupKeybindingValue = {
	description: string;
	callback: () => void;
};
export type PopupKeybindings = { [key: string]: PopupKeybindingValue };

export const toKeybindingWithCallback = (callback: (value: string) => void) => (value: string) => ({ description: value, callback: () => callback(value) });

export const assignKeys = (arr: PopupKeybindingValue[]): PopupKeybindings => {
	if (arr.length > KEYS.length) {
		request('showError', "Couldn't assign keys to all options!");
		return {};
	}

	const result: PopupKeybindings = {};
	const usedKeys = new Set();

	const addIfUnique = (key: string, value: PopupKeybindingValue): boolean => {
		if (usedKeys.has(key)) return false;
		usedKeys.add(key);
		result[key] = value;
		return true;
	};

	arr.filter(value => !addIfUnique(value.description[0], value))
		.filter(value => !addIfUnique(value.description[0].toLowerCase(), value))
		.filter(value => !addIfUnique(value.description[0].toUpperCase(), value))
		.forEach(value => {
			let i = 0;
			let key = value.description[0];
			while (usedKeys.has(key)) key = KEYS[i++];
			usedKeys.add(key);
			result[key] = value;
		});

	return result;
};

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	overflow: hidden;
`;

const Option = styled.p`
	color: var(--vscode-editorHoverWidget-foreground);
	cursor: pointer;
`;

type Props = {
	close: (value: boolean) => void;
	keybindings: PopupKeybindings;
};

const KeybindingPopup: FunctionComponent<Props> = ({ close, keybindings }) => {
	const onKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') close(false);
		if (!keybindings[event.key]) return false;
		keybindings[event.key].callback();
		close(true);
		return true;
	};

	useKeybindings(onKey, 10);

	return (
		<Popup close={close}>
			<Container>
				{Object.entries(keybindings)
					.sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))
					.map(([key, { description, callback }]) => (
						<Option onClickCapture={callback}>
							{key} - {description}
						</Option>
					))}
			</Container>
		</Popup>
	);
};

export default KeybindingPopup;
