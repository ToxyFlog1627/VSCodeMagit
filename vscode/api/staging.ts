import { writeFile } from 'fs/promises';
import { patchPath } from '../extension';
import exec from '../exec';
import * as _parseDiff from 'parse-diff';

const parseDiff = (diff: string) => {
	return _parseDiff(diff).map(({ chunks, from, to }) => ({
		from,
		to,
		hunks: chunks.map(({ content, changes }) => [content, ...changes.map(({ content }) => content)])
	}));
};

const getHunkByHeader = (lines: string[], header: string): string[] | null => {
	const hunkStart = lines.indexOf(header);
	if (hunkStart === -1) return null;
	const hunkEnd = lines.findIndex((line, i) => i > hunkStart && line.startsWith('@@'));

	return hunkEnd === -1 ? lines.slice(hunkStart) : lines.slice(hunkStart, hunkEnd);
};

export const stagedChanges = async () => {
	const { data, error } = await exec('git diff --cached');
	if (error) return { error: true };
	return { data: parseDiff(data) };
};

export const stageAllFiles = async () => {
	const { error } = await exec('git add -u .');
	if (error) return { error: true };
	return { data: null };
};

export const stageFile = async (file: string) => {
	const { error } = await exec(`git add -u ${file}`);
	if (error) return { error: true };
	return { data: null };
};

export const stageHunk = async ({ file, header }: { file: string; header: string }) => {
	const { data } = await exec(`git diff ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await exec(`git apply --cached '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};

export const stageRange = async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
	const { data } = await exec(`git diff ${file}`);
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

	const { error } = await exec(`git apply --cached '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};

export const unstagedChanges = async () => {
	const { data, error } = await exec('git diff');
	if (error) return { error: true };
	return { data: parseDiff(data) };
};

export const unstageAllFiles = async () => {
	const { error } = await exec('git reset .');
	if (error) return { error: true };
	return { data: null };
};

export const unstageFile = async (file: string) => {
	const { error } = await exec(`git reset ${file}`);
	if (error) return { error: true };
	return { data: null };
};

export const unstageHunk = async ({ file, header }: { file: string; header: string }) => {
	const { data } = await exec(`git diff --cached ${file}`);
	const lines = data.split('\n');

	const hunk = getHunkByHeader(lines, header);
	if (!hunk) return { error: true };
	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
	await writeFile(patchPath, patch);

	const { error } = await exec(`git apply --cached -R '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};

export const unstageRange = async ({ file, header, index, length }: { file: string; header: string; index: number; length: number }) => {
	const { data } = await exec(`git diff --cached ${file}`);
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

	const { error } = await exec(`git apply -R --cached '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};
