import {workspace} from "vscode";
import {exec} from "child_process";
import * as _parseDiff from "parse-diff";

export const parseDiff = (diff: string) =>
	_parseDiff(diff).map(({chunks, from, to}) => ({
		from,
		to,
		hunks: chunks.map(({content, changes}) => [content, ...changes.map(({content}) => content)]),
	}));

export const execCommand = (command: string): Promise<{data: string; error: boolean}> => {
	return new Promise((resolve, reject) => {
		exec(`cd ${workspace.workspaceFolders![0].uri.path} && ${command}`, {maxBuffer: 1024 * 1024 * 1024}, (error, stdout, stderr) => {
			if (error) reject(error);
			else if (stderr) resolve({data: stderr, error: true});
			else resolve({data: stdout, error: false});
		});
	});
};
