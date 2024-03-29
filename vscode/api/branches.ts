import exec from '../exec';
import { execAndReturn, execWithoutReturn } from './templates';

const getBranchData = async (selector: string): Promise<{ commit: string; branch: string } | null> => {
	const branch = await exec(`git rev-parse --abbrev-ref --symbolic-full-name ${selector}`);
	if (branch.error) return null;

	const commit = await exec(`git show -s --format=%s ${selector}`);
	if (commit.error) return null;

	return { commit: commit.data.slice(0, -1), branch: branch.data.slice(0, -1) };
};

export const commitBranches = async () => {
	const local = await getBranchData('@');
	if (local === null) return { data: null };

	const remotes = await exec('git remote show');
	if (remotes.error) return { error: true };
	const remotesNumber = remotes.data.split('\n').length - 1;

	let remote = null;
	if (remotesNumber > 0) remote = await getBranchData('@{u}');

	return { data: { local, remote } };
};

export const branches = execAndReturn('git branch -l', data => data.split('\n').slice(0, -1).map(line => line.slice(2))); // prettier-ignore
export const createBranch = execWithoutReturn((branch: string) => `git branch ${branch}`);
export const renameBranch = execWithoutReturn(({ from, to }: { from: string; to: string }) => `git branch -m ${from} ${to}`);
export const deleteBranch = execWithoutReturn((branch: string) => `git branch -d ${branch}`);
export const checkout = execWithoutReturn((branch: string) => `git checkout ${branch}`);
