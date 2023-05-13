import exec from '../exec';

const getBranchData = async (selector: string): Promise<{ commit: string; branch: string } | null> => {
	const branch = await exec(`git rev-parse --abbrev-ref --symbolic-full-name ${selector}`);
	if (branch.error) return null;
	const commit = await exec(`git show -s --format=%s ${selector}`);
	if (commit.error) return null;
	return { commit: commit.data.slice(0, -1), branch: branch.data.slice(0, -1) };
};

export const branches = async () => {
	const local = await getBranchData('@');
	if (local === null) return { error: true };

	const remotes = await exec('git remote show');
	if (remotes.error) return { error: true };
	const remotesNumber = remotes.data.split('\n').length - 1;

	let remote = null;
	if (remotesNumber > 0) {
		remote = await getBranchData('@');
		if (remote === null) return { error: true };
	}

	return { data: { local, remote } };
};
