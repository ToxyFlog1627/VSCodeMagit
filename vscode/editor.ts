import {window, workspace, ViewColumn, ExtensionContext, WebviewPanel, Uri} from "vscode";
import api, {Response} from "./api";
import path = require("path");

let isOpened = false;
let panel: WebviewPanel;

const onMessage = async (panel: WebviewPanel, {id, type, body}: {id: number; type: string; body: any}): Promise<void> => {
	const sendResponse = (response: Response) => void panel.webview.postMessage({id, ...response});

	if (!api[type]) return sendResponse({data: `No operation of type ${type}!`, error: true});
	try {
		sendResponse(await api[type](body));
	} catch (error) {
		window.showErrorMessage(`Magit: Unexpected error: ${error}`);
	}
};

const openMagit = async (context: ExtensionContext) => {
	if (workspace.workspaceFolders === undefined) return window.showErrorMessage("Magit: Magit can only be opened inside of a workspace!");
	if (isOpened) return panel.reveal();
	isOpened = true;

	panel = window.createWebviewPanel("vscode-magit.editor", "Magit", {viewColumn: ViewColumn.Active}, {enableScripts: true});
	panel.iconPath = Uri.joinPath(context.extensionUri, "assets", "icon.png");

	panel.webview.onDidReceiveMessage(message => onMessage(panel, message));
	panel.onDidDispose(() => (isOpened = false));

	panel.webview.html = (await workspace.fs.readFile(Uri.joinPath(context.extensionUri, "page", "index.html"))).toString();
};

const createEditor = (context: ExtensionContext) => () => openMagit(context);
export default createEditor;
