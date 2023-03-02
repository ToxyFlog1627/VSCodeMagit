import {workspace} from "vscode";
import {exec} from "child_process";
import {Response} from "./api";

export const execCommand = (command: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		exec(`cd ${workspace.workspaceFolders![0].uri.path} && ${command}`, (error, stdout, stderr) => {
			if (error) reject(error);
			if (stderr) resolve({data: stderr, error: true});
			if (stdout) resolve({data: stdout, error: false});
		});
	});
};
