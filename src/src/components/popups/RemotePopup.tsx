import { FunctionComponent, useState } from 'react';
import InputPopup from './InputPopup';
import request from '../../utils/api';
import useFetch from '../../hooks/useFetch';
import KeybindingPopup, { PopupKeybindings, assignKeys, toKeybindingWithCallback } from './KeybindingPopup';
import { refetchType } from '../../hooks/useFetch';

type RemoteInputProps = {
	close: () => void;
	callback: (name: string, url: string) => void;
	label: string;
	name?: string;
	url?: string;
};

const RemoteInput: FunctionComponent<RemoteInputProps> = ({ close, callback, label, name: _name, url: _url }) => {
	const [name, setName] = useState(_name);
	const [isNameInputActive, setIsNameInputActive] = useState(true);

	return isNameInputActive ? (
		<InputPopup
			initialValue={_name}
			close={close}
			label={`${label}. Name`}
			onInput={name => {
				setName(name);
				setIsNameInputActive(false);
			}}
		/>
	) : (
		<InputPopup initialValue={_url} close={close} label={`${label}. Url`} onInput={url => callback(name!, url)} />
	);
};

enum Stages {
	DEFAULT,
	CREATE,
	UPDATE,
	DELETE
}

type Props = { close: () => void };

const RemotePopup: FunctionComponent<Props> = ({ close }) => {
	const [stage, setStage] = useState<Stages>(Stages.DEFAULT);
	const [selectedRemote, setSelectedRemote] = useState<string | null>(null);
	const remotes = useFetch<string[]>('remotes');
	const selectedRemoteUrl = useFetch<string>('remoteUrl', { value: selectedRemote });

	const createRemote = async (name: string, url: string) => {
		const { error } = await request('createRemote', { name, url });
		if (error) return request('showError', `Couldn't create remote '${name}' with url '${url}'!`);
		refetchType('remotes', 'remotesWithBranches');
		close();
	};

	const changeRemote = async (name: string, url: string) => {
		if (name !== selectedRemote) {
			const { error } = await request('renameRemote', { from: selectedRemote, to: name });
			if (error) return request('showError', `Couldn't rename remote '${selectedRemote}' to '${name}'!`);
		} else if (url !== selectedRemoteUrl) {
			const { error } = await request('setRemoteUrl', { remote: name, url });
			if (error) return request('showError', "Couldn't set remote's url!");
		}

		refetchType('remotes', 'remotesWithBranches', 'upstreamRemote', 'branches');
		close();
	};

	const deleteRemote = async (remote: string) => {
		const { error } = await request('deleteRemote', remote);
		if (error) return request('showError', `Couldn't delete remote '${remote}'!`);
		refetchType('remotes', 'remotesWithBranches', 'upstreamRemote', 'branches');
		close();
	};

	if (remotes === null) return null;

	if (remotes.length === 0 || stage === Stages.CREATE) return <RemoteInput close={close} callback={createRemote} label="Creating new remote" />;

	if (stage === Stages.UPDATE) {
		if (selectedRemote === null) {
			const keybindings = assignKeys(remotes.map(toKeybindingWithCallback(setSelectedRemote)));
			return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
		}

		if (selectedRemoteUrl === null) return null;
		return <RemoteInput close={close} callback={changeRemote} label="Changing remote" name={selectedRemote} url={selectedRemoteUrl} />;
	}

	if (stage === Stages.DELETE) {
		const keybindings = assignKeys(remotes.map(toKeybindingWithCallback(deleteRemote)));
		return <KeybindingPopup close={close} keybindings={keybindings} />;
	}

	const keybindings: PopupKeybindings = {
		c: { description: 'create remote', callback: () => setStage(Stages.CREATE) },
		u: { description: 'update remote', callback: () => setStage(Stages.UPDATE) },
		d: { description: 'delete remote', callback: () => setStage(Stages.DELETE) }
	};
	return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
};

export default RemotePopup;
