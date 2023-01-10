import {workspace} from "vscode";
import {exec} from "child_process";

const execCommand = (command: string): Promise<[string] | [null, string]> => {
	return new Promise((resolve, reject) => {
		exec(`cd ${workspace.workspaceFolders![0].uri.path} && ${command}`, (error, stdout, stderr) => {
			if (error) reject(error);

			if (stderr) resolve([null, stderr]);
			else resolve([stdout]);
		});
	});
};

const isInRepo = async (): Promise<boolean> => {
	const [result, error] = await execCommand("git rev-parse --is-inside-work-tree");
	if (error) return true;

	return result ? result.startsWith("true") : false;
};

const api: {[key: string]: (body: any) => any} = {
	IS_IN_REPO: isInRepo,
};

export default api;
