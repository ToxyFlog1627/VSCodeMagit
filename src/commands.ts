import {Uri, window, workspace} from "vscode";

const openMagit = async () => {
	const doc = await workspace.openTextDocument(Uri.parse("magit:Magit"));
	window.showTextDocument(doc, {preview: false});
};

const commands: [string, () => void][] = [
	["magit", openMagit],
	["stash", () => console.log("not yet")],
];

export default commands;
