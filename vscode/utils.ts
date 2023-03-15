import {workspace} from "vscode";
import {exec} from "child_process";

export const execCommand = (command: string): Promise<{data: string; error: boolean}> => {
	return new Promise((resolve, reject) => {
		exec(`cd ${workspace.workspaceFolders![0].uri.path} && ${command}`, (error, stdout, stderr) => {
			if (error) reject(error);
			else if (stderr) resolve({data: stderr, error: true});
			else resolve({data: stdout, error: false});
		});
	});
};
