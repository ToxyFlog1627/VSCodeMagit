import { window, workspace, ViewColumn, ExtensionContext, WebviewPanel, Uri, RelativePattern } from 'vscode';
import ignore from 'ignore';
import api, { Response } from './api';

let isOpened = false;
let panel: WebviewPanel;

const onMessage = async ({ id, type, body }: { id: number; type: string; body: any }): Promise<void> => {
	const sendResponse = (response: Response) => void panel.webview.postMessage({ id, ...response });

	if (!api[type]) return sendResponse({ data: `No operation of type ${type}!`, error: true });
	try {
		sendResponse(await api[type](body));
	} catch (error) {
		window.showErrorMessage(`Magit. Unexpected error in ${type}: ${error}`);
	}
};

const openMagit = async (context: ExtensionContext) => {
	if (workspace.workspaceFolders === undefined) return window.showErrorMessage('Magit: Magit can only be opened inside of a workspace!');

	if (isOpened) return panel.reveal();
	isOpened = true;

	panel = window.createWebviewPanel('vscode-magit.editor', 'Magit', { viewColumn: ViewColumn.Active }, { enableScripts: true });
	panel.iconPath = Uri.joinPath(context.extensionUri, 'assets', 'icon.png');

	panel.webview.onDidReceiveMessage(onMessage);
	panel.onDidDispose(() => (isOpened = false));

	let matchGitignore = (_path: string) => true;
	const updateGitignoreMatcher = async () => {
		try {
			const gitignore = await workspace.fs.readFile(Uri.joinPath(workspace.workspaceFolders![0].uri, '.gitignore'));
			const ignoredPatterns = gitignore.toString().split('\n');
			matchGitignore = ignore().add(ignoredPatterns).createFilter();
		} catch (error) {
			error;
		}
	};
	updateGitignoreMatcher();

	const gitignoreWatcher = workspace.createFileSystemWatcher(new RelativePattern(workspace.workspaceFolders[0], '.gitignore'));
	gitignoreWatcher.onDidChange(updateGitignoreMatcher);

	const refreshIfNeeded = (file: Uri) => {
		if (!matchGitignore(file.toString())) return;
		panel.webview.postMessage({ id: -1, type: 'refresh' });
	};

	const watcher = workspace.createFileSystemWatcher('**/*');
	watcher.onDidChange(refreshIfNeeded);
	watcher.onDidCreate(refreshIfNeeded);
	watcher.onDidDelete(refreshIfNeeded);

	const page = await workspace.fs.readFile(Uri.joinPath(context.extensionUri, 'page', 'index.html'));
	panel.webview.html = page.toString();
};

const createEditor = (context: ExtensionContext) => () => openMagit(context);

export default createEditor;
