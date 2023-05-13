import { workspace } from 'vscode';
import { exec } from 'child_process';

const execWrapper = (command: string): Promise<{ data: string; error: boolean }> => {
	return new Promise(resolve => {
		exec(command, { maxBuffer: 1024 * 1024 * 1024, cwd: workspace.workspaceFolders![0].uri.path }, (_error, stdout, stderr) => resolve({ data: stdout, error: !!stderr }));
	});
};

export default execWrapper;
