import {workspace} from "vscode";
import {exec as _exec} from "child_process";

const exec = (command: string): Promise<{data: string; error: boolean; errorMessage: string}> => {
	return new Promise(resolve => {
		_exec(command, {maxBuffer: 1024 * 1024 * 1024, cwd: workspace.workspaceFolders![0].uri.path}, (_error, stdout, stderr) => resolve({data: stdout, error: !!stderr, errorMessage: stderr}));
	});
};

export default exec;
