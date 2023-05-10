import { workspace } from 'vscode';
import { exec } from 'child_process';
import * as _parseDiff from 'parse-diff';

export const parseDiff = (diff: string) => {
	return _parseDiff(diff).map(({ chunks, from, to }) => ({
		from,
		to,
		hunks: chunks.map(({ content, changes }) => [content, ...changes.map(({ content }) => content)])
	}));
};

export const execCommand = (command: string): Promise<{ data: string; error: boolean }> => {
	return new Promise(resolve => {
		exec(command, { maxBuffer: 1024 * 1024 * 1024, cwd: workspace.workspaceFolders![0].uri.path }, (_error, stdout, stderr) => {
			if (stderr) resolve({ data: stderr, error: true });
			else resolve({ data: stdout, error: false });
		});
	});
};

export const getHunkByHeader = (lines: string[], header: string): string[] | null => {
	const hunkStart = lines.indexOf(header);
	if (hunkStart === -1) return null;
	const hunkEnd = lines.findIndex((line, i) => i > hunkStart && line.startsWith('@@'));

	return hunkEnd === -1 ? lines.slice(hunkStart) : lines.slice(hunkStart, hunkEnd);
};
