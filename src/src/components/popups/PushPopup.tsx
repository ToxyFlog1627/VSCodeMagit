import { FunctionComponent, useState } from 'react';
import useFetch, { refetchType } from '../../hooks/useFetch';
import request from '../../utils/api';
import KeybindingPopup, { assignKeys } from './KeybindingPopup';

enum Stages {
	DEFAULT,
	UPSTREAM,
	REMOTE,
	SET_UPSTREAM_REMOTE
}

type Props = { close: () => void };

const PushPopup: FunctionComponent<Props> = ({ close }) => {
	const [stage, setStage] = useState<Stages>(Stages.DEFAULT);
	const remotes = useFetch<string[]>('remotes');
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
		return null;
	}

	// TODO: if (stage === Stages.REMOTE_OTHER_BRANCH) { return null; }

	if (remotesWithBranches === null) return null;
	if (remotesWithBranches.length === 0) {
		// TODO: it should be like `push to other branches`
		return null;
	}

	if (stage === Stages.REMOTE || stage === Stages.SET_UPSTREAM_REMOTE) {
		const keybindings = assignKeys(
			remotesWithBranches.map(value => ({ description: value, callback: () => push(value) })),
			value => value.description[0]
		);
		return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
	}

	if (upstreamRemote && stage === Stages.UPSTREAM) {
		push(upstreamRemote);
		return null;
	}

	// TODO: add option: `o - push to other branches`
	const keybindings: { [key: string]: { description: string; callback: () => void } } = {
		e: { description: 'push elsewhere', callback: () => setStage(Stages.REMOTE) },
		p: { description: 'push and set upstream', callback: () => setStage(Stages.SET_UPSTREAM_REMOTE) }
	};

	if (upstreamRemote) keybindings['u'] = { description: `push upstream (${upstreamRemote})`, callback: () => setStage(Stages.UPSTREAM) };
	return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
};

export default PushPopup;
