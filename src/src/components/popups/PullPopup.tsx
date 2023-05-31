import { FunctionComponent } from 'react';
import useFetch, { refresh } from '../../hooks/useFetch';
import request from '../../utils/api';
import KeybindingPopup, { assignKeys, toKeybindingWithCallback } from './KeybindingPopup';

type Props = { close: () => void };

const PullPopup: FunctionComponent<Props> = ({ close }) => {
	const remotes = useFetch<string[]>('remotes');
	const upstreamRemote = useFetch<string>('upstreamRemote');

	const pull = async (remote: string) => {
		const { error } = await request('pull', remote);
		if (error) return request('showError', "Couldn't pull changes!");
		refresh();
	};

	if (!remotes) return null;
	if (remotes.length === 0) {
		request('showError', 'There are no remotes!');
		return null;
	}

	const keybindings = remotes.map(toKeybindingWithCallback(pull));
	if (upstreamRemote) keybindings.push({ description: `upstream (${upstreamRemote})`, callback: () => pull(upstreamRemote) });
	return <KeybindingPopup close={close} keybindings={assignKeys(keybindings)} />;
};

export default PullPopup;
