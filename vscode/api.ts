import { window } from 'vscode';
import { writeFile } from 'fs/promises';
import { patchPath } from './extension';
import { execCommand, getHunkByHeader, parseDiff } from './utils';

export type Response = { data: any } | { error: boolean };

const api: { [key: string]: (body: any) => Promise<Response> } = {
	showError: async (message: string) => {
		window.showErrorMessage(message);
		return { data: null };
	},
	isInRepo: async () => {
		const { data, error } = await execCommand('git rev-parse --is-inside-work-tree');
		if (!data || error) return { data: false };
		return { data: data.startsWith('true') };
	},
	initRepo: async () => {
		const { data, error } = await execCommand('git init');
		if (!data || error) return { error: true };
		return { data: null };
	},
	commitsNumber: async () => {
		const { data, error } = await execCommand('git rev-list --all --count');
		if (error) return { error: true };
		return { data: Number(data) };
	},
	branches: async () => {
		const localBranch = await execCommand('git rev-parse --abbrev-ref --symbolic-full-name @');
		if (localBranch.error) return { error: true };
		const remoteBranch = await execCommand('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
		if (remoteBranch.error) return { error: true };
		const localCommit = await execCommand('git show -s --format=%s @');
		if (localCommit.error) return { error: true };
		const remoteCommit = await execCommand('git show -s --format=%s @{u}');
		if (remoteCommit.error) return { error: true };

		return {
			data: {
				local: { commit: localCommit.data.slice(0, -1), branch: localBranch.data.slice(0, -1) },
				remote: { commit: remoteCommit.data.slice(0, -1), branch: remoteBranch.data.slice(0, -1) }
			}
		};
	},
	untrackedFiles: async () => {
		const { data, error } = await execCommand('git ls-files --others --exclude-standard');
		if (error) return { error: true };
		return { data: data.split('\n')?.slice(0, -1) || [] };
	},
	unstagedChanges: async () => {
		const { data, error } = await execCommand('git diff');
		if (error) return { error: true };
		return { data: parseDiff(data) };
	},
	stagedChanges: async () => {
		const { data, error } = await execCommand('git diff --cached');
		if (error) return { error: true };
		return { data: parseDiff(data) };
	},
	commits: async () => {
		const separator = '|||';
		const { data, error } = await execCommand(`git log --pretty="format:%h${separator}%B"`);
		if (error) return { error: true };

		const lines = data.split('\n');
		const commits = lines.filter(line => line.length > 1).map(line => line.split(separator));
		return { data: commits };
	},
	addFile: async (file: string) => {
		const { error } = await execCommand(`git add ${file}`);
		if (error) return { error: true };
		return { data: null };
	},
	addAllFiles: async () => {
		const { error } = await execCommand('git add $(git ls-files --others --exclude-standard)');
		if (error) return { error: true };
		return { data: null };
	},
	stageAllFiles: async () => {
		const { error } = await execCommand('git add -u .');
		if (error) return { error: true };
		return { data: null };
	},
	stageFile: async (file: string) => {
		const { error } = await execCommand(`git add -u ${file}`);
		if (error) return { error: true };
		return { data: null };
	},
	stageHunk: async ({ file, header }: { file: string; header: string }) => {
		const { data } = await execCommand(`git diff ${file}`);
		const lines = data.split('\n');

		const hunk = getHunkByHeader(lines, header);
		if (!hunk) return { error: true };
		const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

		const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
		await writeFile(patchPath, patch);

		const { error } = await execCommand(`git apply --cached '${patchPath}'`);
		if (error) return { error: true };
		return { data: null };
	},
	stageRange: async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
		const { data } = await execCommand(`git diff ${file}`);
		const lines = data.split('\n');

		const hunk = getHunkByHeader(lines, header);
		if (!hunk) return { error: true };
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
		if (!patchBody.some(line => line[0] === '-' || line[0] === '+')) return { data: null };

		const lineNumber = Number(hunk[0].split(',')[0].split('-')[1]);
		const originalLength = patchBody.filter(line => line[0] === '-' || line[0] === ' ').length;
		const modifiedLength = patchBody.filter(line => line[0] === '+' || line[0] === ' ').length;
		const hunkHeader = `@@ -${lineNumber},${originalLength} +${lineNumber},${modifiedLength} @@`;

		const patch = `${fileHeader.join('\n')}\n${hunkHeader}\n${patchBody.join('\n')}\n`;
		await writeFile(patchPath, patch);

		const { error } = await execCommand(`git apply --cached '${patchPath}'`);
		if (error) return { error: true };
		return { data: null };
	},
	unstageAllFiles: async () => {
		const { error } = await execCommand('git reset .');
		if (error) return { error: true };
		return { data: null };
	},
	unstageFile: async (file: string) => {
		const { error } = await execCommand(`git reset ${file}`);
		if (error) return { error: true };
		return { data: null };
	},
	unstageHunk: async ({ file, header }: { file: string; header: string }) => {
		const { data } = await execCommand(`git diff --cached ${file}`);
		const lines = data.split('\n');

		const hunk = getHunkByHeader(lines, header);
		if (!hunk) return { error: true };
		const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

		const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
		await writeFile(patchPath, patch);

		const { error } = await execCommand(`git apply --cached -R '${patchPath}'`);
		if (error) return { error: true };
		return { data: null };
	},
	unstageRange: async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
		const { data } = await execCommand(`git diff --cached ${file}`);
		const lines = data.split('\n');

		const hunk = getHunkByHeader(lines, header);
		if (!hunk) return { error: true };
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
		if (!patchBody.some(line => line[0] === '-' || line[0] === '+')) return { data: null };

		const lineNumber = Number(hunk[0].split(',')[0].split('-')[1]);
		const originalLength = patchBody.filter(line => line[0] === '-' || line[0] === ' ').length;
		const modifiedLength = patchBody.filter(line => line[0] === '+' || line[0] === ' ').length;
		const hunkHeader = `@@ -${lineNumber},${originalLength} +${lineNumber},${modifiedLength} @@`;

		const patch = `${fileHeader.join('\n')}\n${hunkHeader}\n${patchBody.join('\n')}\n`;
		await writeFile(patchPath, patch);

		const { error } = await execCommand(`git apply -R --cached '${patchPath}'`);
		if (error) return { error: true };
		return { data: null };
	}
};

export default api;
