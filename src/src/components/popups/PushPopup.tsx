import { FunctionComponent, useState } from 'react';
import useFetch, { refetchType } from '../../hooks/useFetch';
import request from '../../utils/api';
import KeybindingPopup, { PopupKeybindings, assignKeys, toKeybindingWithCallback } from './KeybindingPopup';

enum Stages {
	DEFAULT,
	REMOTE,
	SET_UPSTREAM_REMOTE,
	REMOTE_OTHER_BRANCH
}

type Props = { close: () => void };

const PushPopup: FunctionComponent<Props> = ({ close }) => {
	const [stage, setStage] = useState<Stages>(Stages.DEFAULT);
	const [selectedRemote, setSelectedRemote] = useState<string | null>(null);
	const remotes = useFetch<string[]>('remotes');
	const branches = useFetch<string[]>('branches');
	const remotesWithBranches = useFetch<string[]>('remotesWithBranches');
	const upstreamRemote = useFetch<string>('upstreamRemote');

	const push = async (remote: string, branch?: string) => {
		if (!branch) [remote, branch] = remote.split('/');
		const { error } = await request('push', { remote, branch, setUpstream: stage === Stages.SET_UPSTREAM_REMOTE });
		if (error) return request('showError', `Couldn't push changes to ${remote}/${branch}!`);
		refetchType('branches', 'remotes', 'remotesWithBranches', 'upstreamRemote');
		close();
	};

	if (remotes === null) return null;
	if (remotes.length === 0) {
		request('showError', 'There are no remotes!');
		close();
		return null;
	}

	if (remotesWithBranches === null) return null;
	if (stage === Stages.REMOTE_OTHER_BRANCH || remotesWithBranches.length === 0) {
		if (selectedRemote === null) {
			const keybindings = assignKeys(remotes.map(toKeybindingWithCallback(setSelectedRemote)));
			return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
		}

		if (branches === null) return null;
		const keybindings = assignKeys(branches.map(toKeybindingWithCallback(branch => push(selectedRemote, branch))));
		return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
	}

	if (stage === Stages.REMOTE || stage === Stages.SET_UPSTREAM_REMOTE) {
		const keybindings = assignKeys(remotesWithBranches.map(toKeybindingWithCallback(push)));
		return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
	}

	const keybindings: PopupKeybindings = {
		e: { description: 'push elsewhere', callback: () => setStage(Stages.REMOTE) },
		p: { description: 'push and set upstream', callback: () => setStage(Stages.SET_UPSTREAM_REMOTE) },
		o: { description: 'push to other branches', callback: () => setStage(Stages.REMOTE_OTHER_BRANCH) }
	};

	if (upstreamRemote) keybindings['u'] = { description: `push upstream (${upstreamRemote})`, callback: () => push(upstreamRemote) };
	return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
};

export default PushPopup;
