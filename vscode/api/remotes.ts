import exec from '../exec';
import { execAndReturn, execWithoutReturn } from './templates';

export const upstreamRemote = async () => {
	const { data, error, errorMessage } = await exec('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
	if (error) {
		if (errorMessage.startsWith('fatal: no upstream configured for branch')) return { data: null };
		return { error: true };
	}

	return { data: data.replace(/\s+$/, '') };
};

export const remotes = execAndReturn("git remote -v | grep '(push)'", data => data.split('\n').map(remote => remote.split('  ')[0]));

export const remotesWithBranches = execAndReturn('git ranch -a', data =>
	data
		.split('\n')
		.map(remote => remote.slice(2))
		.filter(remote => remote.startsWith('remotes/'))
		.map(remote => remote.slice(8))
);

export const remoteUrl = async (remote: null | string) => {
	if (remote === null) return { data: null };
	const { data, error } = await exec(`git remote get-url ${remote}`);
	if (error) return { error: true };
	return { data };
};

export const createRemote = execWithoutReturn(({ name, url }: { name: string; url: string }) => `git remote add ${name} ${url}`);
export const renameRemote = execWithoutReturn(({ from, to }: { from: string; to: string }) => `git remote rename ${from} ${to}`);
export const deleteRemote = execWithoutReturn((branch: string) => `git remote remove ${branch}`);
export const setRemoteUrl = execWithoutReturn(({ name, url }: { name: string; url: string }) => `git remote set-url ${name} ${url}`);
export const pull = execWithoutReturn((remote: string) => `git pull ${remote}`);

export const push = async ({ remote, branch, setUpstream }: { remote: string; branch: string; setUpstream: boolean }) => {
	const { data, error, errorMessage } = await exec(`git push ${setUpstream ? '-u' : ''} ${remote} ${branch}`);
	return { data: error ? data : errorMessage };
};
