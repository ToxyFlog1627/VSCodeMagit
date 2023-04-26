import {execCommand, parseDiff} from "./utils";

export type Response = {data: any; error: boolean};

const isInRepo = async () => {
	const {data, error} = await execCommand("git rev-parse --is-inside-work-tree");
	if (!data || error) return {data: null, error: false};
	return {data: data.startsWith("true"), error: false};
};

const getBranches = async () => {
	const localCommit = await execCommand("git show -s --format=%s @");
	if (!localCommit.data || localCommit.error) return {data: null, error: false};
	const remoteCommit = await execCommand("git show -s --format=%s @{u}");
	if (!remoteCommit.data || remoteCommit.error) return {data: null, error: false};
	const localBranch = await execCommand("git rev-parse --abbrev-ref --symbolic-full-name @");
	if (!localBranch.data || localBranch.error) return {data: null, error: false};
	const remoteBranch = await execCommand("git rev-parse --abbrev-ref --symbolic-full-name @{u}");
	if (!remoteBranch.data || remoteBranch.error) return {data: null, error: false};

	const branches = {local: {commit: localCommit.data.slice(0, -1), branch: localBranch.data.slice(0, -1)}, remote: {commit: remoteCommit.data.slice(0, -1), branch: remoteBranch.data.slice(0, -1)}};
	return {data: branches, error: false};
};

const getUntrackedFiles = async () => {
	const {data, error} = await execCommand("git ls-files --others --exclude-standard");
	if (error) return {data: null, error: true};
	return {data: data.split("\n")?.slice(0, -1) || [], error: false};
};

const getUnstagedChanges = async () => {
	const {data, error} = await execCommand("git diff");
	if (error) return {data: null, error: true};
	return {data: parseDiff(data), error: false};
};

const getStagedChanges = async () => {
	const {data, error} = await execCommand("git diff --cached");
	if (error) return {data: null, error: true};
	return {data: parseDiff(data), error: false};
};

const getCommits = async () => {
	const {data, error} = await execCommand('git log --pretty="format:%h %B"');
	if (error) return {data: null, error: true};
	const commits = data.split("\n").filter((_, i) => i % 2 == 0);
	return {data: commits.map(line => [line.slice(0, 7), line.slice(8)]), error: false};
};

const api: {[key: string]: (body: any) => Promise<Response>} = {
	IS_IN_REPO: isInRepo,
	GET_BRANCHES: getBranches,
	GET_UNTRACKED_FILES: getUntrackedFiles,
	GET_UNSTAGED_CHANGES: getUnstagedChanges,
	GET_STAGED_CHANGES: getStagedChanges,
	GET_COMMITS: getCommits,
};

export default api;
