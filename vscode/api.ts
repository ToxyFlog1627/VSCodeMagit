import {execCommand} from "./utils";

export type Response = {data: any; error: boolean};

const isInRepo = async () => {
	const {data, error} = await execCommand("git rev-parse --is-inside-work-tree");
	if (!data || error) return {data: false, error: false};
	return {data: data.startsWith("true"), error: false};
};

const getUntrackedFiles = async () => {
	const {data, error} = await execCommand("git ls-files --others --exclude-standard");
	if (error) return {data: null, error: true};
	return {data: data.split("\n")?.slice(0, -1) || [], error: false};
};

const getUnstagedChanges = async () => {
	const {data, error} = await execCommand("git diff");
	if (error) return {data: null, error: true};
	if (!data || data.length < 20) return {data: [], error: false};

	let i = 0;
	const result = [];
	const lines = data.split("\n");
	while (i < lines.length) {
		if (!lines[i].startsWith("diff --git")) return {data: [], error: true};
		i += 2;

		if (!lines[i].startsWith("---")) {
			i++;
			continue;
		}

		const path = lines[i++].slice(6);
		const action = lines[i++].slice(4) === "/dev/null" ? "deleted" : "modified";
		const changes: string[][] = [];

		while (i < lines.length && !lines[i].startsWith("diff --git")) {
			if (lines[i].startsWith("@@ ")) changes.push([]);
			changes[changes.length - 1].push(lines[i++]);
		}

		result.push([action, path, changes]);
	}

	return {data: result, error: false};
};

const getStagedChanges = async () => {
	const {data, error} = await execCommand("git diff --staged");
	if (error) return {data: null, error: true};

	// handle renames

	return {data: null, error: false};
};

const api: {[key: string]: () => Promise<Response>} = {
	IS_IN_REPO: isInRepo,
	GET_UNTRACKED_FILES: getUntrackedFiles,
	GET_UNSTAGED_CHANGES: getUnstagedChanges,
	GET_STAGED_CHANGES: getStagedChanges,
};

export default api;
