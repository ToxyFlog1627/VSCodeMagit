import {window, workspace, ViewColumn, ExtensionContext, WebviewPanel, Uri} from "vscode";
import api from "./api";

let isOpened = false;
let panel: WebviewPanel;

const onMessage = async (panel: WebviewPanel, {id, type, body}: {id: number; type: string; body: any}): Promise<void> => {
	const sendResponse = (data: any, error?: string) => void panel.webview.postMessage({id, error, data});

	if (!api[type]) return sendResponse(null, `No operation of type ${type}!`);
	try {
		sendResponse(await api[type](body));
	} catch (error) {
		window.showErrorMessage(`Magit: Unexpected error: ${error}`);
		console.error(error);
	}
};

const openMagit = async (context: ExtensionContext) => {
	if (workspace.workspaceFolders === undefined) return window.showErrorMessage("Magit: Magit can only be opened inside of a workspace!");
	if (isOpened) return panel.reveal();
	isOpened = true;

	const getFileUrl = (filename: string): Uri => panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, "page", filename));

	panel = window.createWebviewPanel("vscode-magit.editor", "Magit", {viewColumn: ViewColumn.Active}, {enableScripts: true});
	panel.iconPath = Uri.joinPath(context.extensionUri, "assets", "icon.png");

	panel.webview.onDidReceiveMessage(message => onMessage(panel, message));
	panel.onDidDispose(() => (isOpened = false));

	panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="${getFileUrl("styles.css")}" rel="stylesheet" />
            <title>Magit</title>
        </head>
        <body>
            <div class="foldable-without-title">
                <div class="chevron"></div>
                <div class="foldable-content">
                    <div class="column">
                        <p>Head:</p>
                        <p>Merge:</p>
                    </div>
                    <div class="column">
                        <p><span class="blue">master</span> Cmake configured</p>
                        <p><span class="green">origin/master</span> Cmake configured</p>
                    </div>
                </div>
            </div>
            <div class="foldable">
                <div class="row">
                    <div class="chevron"></div>
                    <div class="foldable-title">Untracked files</div>
                </div>
                <div class="row">
                    <div class="chevron invisible"></div>
                    <div class="foldable-content">
                        <div class="column untracked">
                            <p>src/tcp_client.cpp</p>
                            <p>src/tcp_client.hpp</p>
                            <p>src/tcp_server.cpp</p>
                            <p>src/tcp_server.hpp</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="foldable">
                <div class="row">
                    <div class="chevron"></div>
                    <div class="foldable-title">Unstaged changes</div>
                </div>
                <div class="row">
                    <div class="chevron invisible"></div>
                    <div class="foldable-content">
                        <div class="column">
                            <p>modified</p>
                            <p>created</p>
                            <p>modified</p>
                            <p>modified</p>
                            <p>deleted</p>
                        </div>
                        <div class="column">
                            <p>CMakeLists.txt</p>
                            <p>src/client.cpp</p>
                            <p>src/common.cpp</p>
                            <p>src/common.hpp</p>
                            <p>src/server.cpp</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="foldable">
                <div class="row">
                    <div class="chevron"></div>
                    <div class="foldable-title">Commits</div>
                </div>
                <div class="row">
                    <div class="chevron invisible"></div>
                    <div class="foldable-content">
                        <div class="column hashes">
                            <p>df60f93</p>
                            <p>df60f93</p>
                            <p>df60f93</p>
                        </div>
                        <div class="column">
                            <p><span class="blue">master</span> <span class="green">origin/master</span> last one</p>
                            <p>Very very very lon text ASDoMwet</p>
                            <p>text</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        <script src="${getFileUrl("script.js")}"></script>
        </html>
    `;
};

const createEditor = (context: ExtensionContext) => () => openMagit(context);
export default createEditor;
