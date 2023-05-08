import { writeFile } from 'fs/promises';
import { patchPath } from './extension';
import { execCommand, getHunkByHeader, parseDiff } from './utils';

export type Response = { data: any; error: boolean };

const isInRepo = async () => {
	const { data, error } = await execCommand('git rev-parse --is-inside-work-tree');
	if (!data || error) return { data: null, error: false };
	return { data: data.startsWith('true'), error: false };
};

const branches = async () => {
	const localCommit = await execCommand('git show -s --format=%s @');
	if (!localCommit.data || localCommit.error) return { data: null, error: false };
	const remoteCommit = await execCommand('git show -s --format=%s @{u}');
	if (!remoteCommit.data || remoteCommit.error) return { data: null, error: false };
	const localBranch = await execCommand('git rev-parse --abbrev-ref --symbolic-full-name @');
	if (!localBranch.data || localBranch.error) return { data: null, error: false };
	const remoteBranch = await execCommand('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
	if (!remoteBranch.data || remoteBranch.error) return { data: null, error: false };

	const branches = {
		local: { commit: localCommit.data.slice(0, -1), branch: localBranch.data.slice(0, -1) },
		remote: { commit: remoteCommit.data.slice(0, -1), branch: remoteBranch.data.slice(0, -1) }
	};
	return { data: branches, error: false };
};

const untrackedFiles = async () => {
	const { data, error } = await execCommand('git ls-files --others --exclude-standard');
	if (error) return { data: null, error: true };
	return { data: data.split('\n')?.slice(0, -1) || [], error: false };
};

const unstagedChanges = async () => {
	const { data, error } = await execCommand('git diff');
	if (error) return { data: null, error: true };
	return { data: parseDiff(data), error: false };
};

const stagedChanges = async () => {
	const { data, error } = await execCommand('git diff --cached');
	if (error) return { data: null, error: true };
	return { data: parseDiff(data), error: false };
};

const commits = async () => {
	const { data, error } = await execCommand('git log --pretty="format:%h %B"');
	if (error) return { data: null, error: true };
	const commits = data.split('\n').filter((_, i) => i % 2 == 0);
	return { data: commits.map(line => [line.slice(0, 7), line.slice(8)]), error: false };
};

const addFile = async (file: string) => {
	const { error } = await execCommand(`git add ${file}`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const addAllFiles = async () => {
	const { error } = await execCommand('git add $(git ls-files --others --exclude-standard)');
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const stageAllFiles = async () => {
	const { error } = await execCommand('git add -u .');
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const stageFile = async (file: string) => {
	const { error } = await execCommand(`git add -u ${file}`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const stageHunk = async ({ file, header }: { file: string; header: string }) => {
	const { data } = await execCommand(`git diff ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { data: null, error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await execCommand(`git apply --cached '${patchPath}'`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const stageRange = async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
	const { data } = await execCommand(`git diff ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { data: null, error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patchBody = hunk
		.slice(1)
		.map((line, i) => {
			if (index <= i && i < index + length) return line;
			if (line[0] === '+') return null;
			if (line[0] === '-') return ` ${line.slice(1)}`;
			return line;
		})
		.filter(line => line !== null) as string[];
	if (!patchBody.some(line => line[0] === '-' || line[0] === '+')) return { data: null, error: false };

	const lineNumber = Number(hunk[0].split(',')[0].split('-')[1]);
	const originalLength = patchBody.filter(line => line[0] === '-' || line[0] === ' ').length;
	const modifiedLength = patchBody.filter(line => line[0] === '+' || line[0] === ' ').length;
	const hunkHeader = `@@ -${lineNumber},${originalLength} +${lineNumber},${modifiedLength} @@`;

	const patch = `${fileHeader.join('\n')}\n${hunkHeader}\n${patchBody.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await execCommand(`git apply --cached '${patchPath}'`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const unstageAllFiles = async () => {
	const { error } = await execCommand('git reset .');
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const unstageFile = async (file: string) => {
	const { error } = await execCommand(`git reset ${file}`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const unstageHunk = async ({ file, header }: { file: string; header: string }) => {
	const { data } = await execCommand(`git diff --cached ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { data: null, error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await execCommand(`git apply --cached -R '${patchPath}'`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const unstageRange = async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
	const { data } = await execCommand(`git diff --cached ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { data: null, error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patchBody = hunk
		.slice(1)
		.map((line, i) => {
			if (index <= i && i < index + length) return line;
			if (line[0] === '-') return null;
			if (line[0] === '+') return ` ${line.slice(1)}`;
			return line;
		})
		.filter(line => line !== null) as string[];
	if (!patchBody.some(line => line[0] === '-' || line[0] === '+')) return { data: null, error: false };

	const lineNumber = Number(hunk[0].split(',')[0].split('-')[1]);
	const originalLength = patchBody.filter(line => line[0] === '-' || line[0] === ' ').length;
	const modifiedLength = patchBody.filter(line => line[0] === '+' || line[0] === ' ').length;
	const hunkHeader = `@@ -${lineNumber},${originalLength} +${lineNumber},${modifiedLength} @@`;

	const patch = `${fileHeader.join('\n')}\n${hunkHeader}\n${patchBody.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await execCommand(`git apply -R --cached '${patchPath}'`);
	if (error) return { data: null, error: true };
	return { data: null, error: false };
};

const api: { [key: string]: (body: any) => Promise<Response> } = {
	isInRepo,
	branches,
	untrackedFiles,
	unstagedChanges,
	stagedChanges,
	commits,
	addFile,
	addAllFiles,
	stageAllFiles,
	stageFile,
	stageHunk,
	stageRange,
	unstageAllFiles,
	unstageFile,
	unstageHunk,
	unstageRange
};

export default api;
