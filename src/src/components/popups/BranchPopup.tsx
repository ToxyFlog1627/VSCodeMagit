import { FunctionComponent, useState } from 'react';
import useFetch, { refetchType } from '../../hooks/useFetch';
import KeybindingPopup, { assignKeys, toKeybindingWithCallback } from './KeybindingPopup';
import InputPopup from './InputPopup';
import request from '../../utils/api';

enum Stages {
	DEFAULT,
	CREATE,
	DELETE,
	RENAME,
	CHECKOUT
}

type Props = { close: () => void };

const BranchPopup: FunctionComponent<Props> = ({ close }) => {
	const [stage, setStage] = useState<Stages>(Stages.DEFAULT);
	const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
	const branches = useFetch<string[]>('branches');

	const createBranch = async (branch: string) => {
		const { error } = await request('createBranch', branch);
		if (error) return request('showError', `Couldn't create branch '${branch}'!`);
		refetchType();
	};

	const deleteBranch = async (branch: string) => {
		const { error } = await request('deleteBranch', branch);
		if (error) return request('showError', `Couldn't delete branch '${branch}'!`);
		refetchType();
	};

	const renameBranch = async (branch: string) => {
		const { error } = await request('renameBranch', { from: selectedBranch, to: branch });
		if (error) return request('showError', `Couldn't rename branch '${selectedBranch}' to '${branch}'!`);
		refetchType();
	};

	const checkout = async (branch: string) => {
		const { error } = await request('checkout', branch);
		if (error) return request('showError', "Couldn't checkout!");
	};

	if (!branches) return null;

	if (branches.length === 0 || stage === Stages.CREATE) {
		return <InputPopup close={close} onInput={createBranch} label="Creating branch" />;
	}

	if (stage === Stages.DELETE) {
		const keybindings = assignKeys(branches.map(toKeybindingWithCallback(deleteBranch)));
		return <KeybindingPopup close={close} keybindings={keybindings} />;
	}

	if (stage === Stages.RENAME) {
		if (selectedBranch === null) {
			const keybindings = assignKeys(branches.map(toKeybindingWithCallback(setSelectedBranch)));
			return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
		}

		return <InputPopup close={close} onInput={renameBranch} label="Renaming branch" initialValue={selectedBranch} />;
	}

	if (stage === Stages.CHECKOUT) {
		const keybindings = assignKeys(branches.map(toKeybindingWithCallback(checkout)));
		return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
	}

	const keybindings = {
		b: { description: 'checkout', callback: () => setStage(Stages.CHECKOUT) },
		c: { description: 'create branch', callback: () => setStage(Stages.CREATE) },
		r: { description: 'rename branch', callback: () => setStage(Stages.RENAME) },
		d: { description: 'delete remote', callback: () => setStage(Stages.DEFAULT) }
	};
	return <KeybindingPopup close={success => !success && close()} keybindings={keybindings} />;
};

export default BranchPopup;
