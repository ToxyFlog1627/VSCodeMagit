import ignore from 'ignore';
import { RelativePattern, Uri, workspace } from 'vscode';

const onTrackedFilesChange = (onChange: () => void): (() => void) => {
	const folder = workspace.workspaceFolders![0];

	let matchGitignore = (_path: string) => true;
	const updateGitignoreMatcher = async () => {
		try {
			const gitignore = await workspace.fs.readFile(Uri.joinPath(folder.uri, '.gitignore'));
			const ignoredPatterns = gitignore.toString().split('\n');
			matchGitignore = ignore().add(ignoredPatterns).createFilter();
		} catch (error) {
			error;
		}
	};

	const gitignoreWatcher = workspace.createFileSystemWatcher(new RelativePattern(folder, '.gitignore'));
	gitignoreWatcher.onDidChange(updateGitignoreMatcher);
	updateGitignoreMatcher();

	const callCallbackIfFileIsTracked = (file: Uri) => {
		if (!matchGitignore(file.toString())) return;
		onChange();
	};

	const watcher = workspace.createFileSystemWatcher('**/*');
	watcher.onDidChange(callCallbackIfFileIsTracked);
	watcher.onDidCreate(callCallbackIfFileIsTracked);
	watcher.onDidDelete(callCallbackIfFileIsTracked);

	return () => {
		watcher.dispose();
		gitignoreWatcher.dispose();
	};
};

export default onTrackedFilesChange;
