import { writeFile } from 'fs/promises';
import { patchPath } from '../extension';
import exec from '../exec';
import { execWithoutReturn } from './templates';

const getHunkAndFileHeader = async (header: string, command: string): Promise<[string[], string[]] | [null, null]> => {
	const { data, error } = await exec(command);
	if (error) return [null, null];
	const lines = data.split('\n');

	const hunkStart = lines.indexOf(header);
	if (hunkStart === -1) return [null, null];
	const hunkEnd = lines.findIndex((line, i) => i > hunkStart && line.startsWith('@@'));

	const hunk = hunkEnd === -1 ? lines.slice(hunkStart) : lines.slice(hunkStart, hunkEnd);
	if (hunk === null) return [null, null];

	const fileHeader = lines.filter(line => line.startsWith('---') || line.startsWith('+++'));

	return [hunk, fileHeader];
};

export const stageAllFiles = execWithoutReturn('git add -u .');
export const unstageAllFiles = execWithoutReturn('git reset .');

export const stageFile = execWithoutReturn((file: string) => `git add -u ${file}`);
export const unstageFile = execWithoutReturn((file: string) => `git reset ${file}`);

type HunkPos = {
	file: string;
	header: string;
};

const writeHunkToPatchFile = async (header: string, command: string): Promise<boolean> => {
	const [hunk, fileHeader] = await getHunkAndFileHeader(header, command);
	if (hunk === null) return false;

	const patch = `${fileHeader.join('\n')}\n${hunk.join('\n')}\n`;
	await writeFile(patchPath, patch);

	return true;
};

export const stageHunk = async ({ file, header }: HunkPos) => {
	await writeHunkToPatchFile(header, `git diff ${file}`);

	const { error } = await exec(`git apply --cached '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};
export const unstageHunk = async ({ file, header }: HunkPos) => {
	await writeHunkToPatchFile(header, `git diff --cached ${file}`);

	const { error } = await exec(`git apply --cached -R '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};

type RangePos = {
	file: string;
	header: string;
	index: number;
	length: number;
};

const writeRangeToPatchFile = async (hunk: string[], fileHeader: string[], body: string[]) => {
	const lineNumber = Number(hunk[0].split(',')[0].split('-')[1]);
	const originalLength = body.filter(line => line[0] === '-' || line[0] === ' ').length;
	const modifiedLength = body.filter(line => line[0] === '+' || line[0] === ' ').length;
	const hunkHeader = `@@ -${lineNumber},${originalLength} +${lineNumber},${modifiedLength} @@`;

	const patch = `${fileHeader.join('\n')}\n${hunkHeader}\n${body.join('\n')}\n`;
	await writeFile(patchPath, patch);
};

export const stageRange = async ({ file, header, index, length }: RangePos) => {
	const [hunk, fileHeader] = await getHunkAndFileHeader(header, `git diff ${file}`);
	if (hunk === null) return { error: true };

	const body = hunk
		.slice(1)
		.map((line, i) => {
			if (index <= i && i < index + length) return line;
			if (line[0] === '+') return null;
			if (line[0] === '-') return ` ${line.slice(1)}`;
			return line;
		})
		.filter(line => line !== null) as string[];
	if (!body.some(line => line[0] === '-' || line[0] === '+')) return { data: null };

	await writeRangeToPatchFile(hunk, fileHeader, body);

	const { error } = await exec(`git apply --cached '${patchPath}'`);
	console.log(patchPath);
	if (error) return { error: true };
	return { data: null };
};
export const unstageRange = async ({ file, header, index, length }: RangePos) => {
	const [hunk, fileHeader] = await getHunkAndFileHeader(header, `git diff --cached ${file}`);
	if (hunk === null) return { error: true };

	const body = hunk
		.slice(1)
		.map((line, i) => {
			if (index <= i && i < index + length) return line;
			if (line[0] === '-') return null;
			if (line[0] === '+') return ` ${line.slice(1)}`;
			return line;
		})
		.filter(line => line !== null) as string[];
	if (!body.some(line => line[0] === '-' || line[0] === '+')) return { data: null };

	await writeRangeToPatchFile(hunk, fileHeader, body);

	const { error } = await exec(`git apply -R --cached '${patchPath}'`);
	if (error) return { error: true };
	return { data: null };
};
