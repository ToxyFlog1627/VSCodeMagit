import { FunctionComponent } from 'react';
import Changes, { Diff } from '../components/Changes';
import useFetch from '../hooks/useFetch';

const StagedChanges: FunctionComponent = () => {
	const diff = useFetch<Diff>('stagedChanges');

	const unstageAll = async () => {};

	const unstageFile = async (file: string) => {};

	const unstageHunk = async (file: string, from: string, to: string, hunk: string[]) => {};

	const unstageRange = async (file: string, hunk: string[], from: number, length: number) => {};

	if (diff === null || diff.length === 0) return null;
	return (
		<Changes
			title="Staged changes"
			diff={diff}
			globalKey="U"
			globalAction={unstageAll}
			actionKey="u"
			fileAction={unstageFile}
			hunkAction={unstageHunk}
			rangeAction={unstageRange}
		/>
	);
};

export default StagedChanges;
