import { FunctionComponent, useContext } from 'react';
import Changes, { Diff } from '../components/Changes';
import useFetch, { updateSubscribed } from '../hooks/useFetch';
import request from '../utils/api';
import { ErrorContext } from '../App';

// TODO: test all unstagedChanges' actions

const UnstagedChanges: FunctionComponent = () => {
	const diff = useFetch<Diff>('unstagedChanges');
	const { setError } = useContext(ErrorContext);

	const stageAll = async () => {
		const { error } = await request('stageAllFiles');
		if (error) return setError("Couldn't add files!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageFile = async (file: string) => {
		const { error } = await request('stageFile', file);
		if (error) return setError("Couldn't add file!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageHunk = async (file: string, from: string, to: string, hunk: string[]) => {
		const patch = `--- a/${from}\n+++ b/${to}\n${hunk.join('\n')}`;
		const { error } = await request('stagePatch', { file, patch });
		if (error) return setError("Couldn't add range!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageRange = async (file: string, hunk: string[], from: number, length: number) => {
		const patch = ''; // TODO: patch the hunk to make the patch
		const { error } = await request('stagePatch', { file, patch });
		if (error) return setError("Couldn't add range!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	if (diff === null || diff.length === 0) return null;
	return (
		<Changes title="Unstaged changes" diff={diff} globalKey="S" globalAction={stageAll} actionKey="s" fileAction={stageFile} hunkAction={stageHunk} rangeAction={stageRange} />
	);
};

// TODO: make changes one function inside of which based on if we selected between (un)staged as a lot of code is duplicated/complicated by this abstraction that is practically useless

export default UnstagedChanges;
