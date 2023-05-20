import { window, workspace, ViewColumn, ExtensionContext, WebviewPanel, Uri } from 'vscode';
import api, { Response } from './api';
import onTrackedFilesChange from './fileWatcher';

let isOpened = false;
let panel: WebviewPanel;

const onMessage = async ({ id, type, body }: { id: number; type: string; body: any }): Promise<void> => {
	const sendResponse = (response: Response) => void panel.webview.postMessage({ id, ...response });

	if (!api[type]) return sendResponse({ error: true });
	try {
		sendResponse(await api[type](body));
	} catch (error) {
		window.showErrorMessage(`Magit. Unexpected error in ${type}: ${error}`);
	}
};

const openMagit = async (context: ExtensionContext) => {
	if (!workspace.workspaceFolders) return window.showErrorMessage('Magit: Magit can only be opened inside of a workspace!');
	if (isOpened) return panel.reveal();

	panel = window.createWebviewPanel('vscode-magit.editor', 'Magit', { viewColumn: ViewColumn.Active }, { enableScripts: true });
	panel.iconPath = Uri.joinPath(context.extensionUri, 'assets', 'icon.png');
	panel.webview.onDidReceiveMessage(onMessage);

	const refresh = () => panel.webview.postMessage({ id: -1, type: 'refresh' });
	const disposeFileWatcher = onTrackedFilesChange(refresh);

	panel.onDidDispose(() => {
		isOpened = false;
		disposeFileWatcher();
	});

	const page = await workspace.fs.readFile(Uri.joinPath(context.extensionUri, 'page', 'index.html'));
	panel.webview.html = page.toString();
	isOpened = true;
};

const createWindow = (context: ExtensionContext) => () => openMagit(context);

export default createWindow;
