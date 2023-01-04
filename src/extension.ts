import {commands, ExtensionContext} from "vscode";
import MagitEditor from "./editor";
import magitCommands from "./commands";

export const activate = async (context: ExtensionContext) => {
	context.subscriptions.push(MagitEditor.register());
	context.subscriptions.push(...magitCommands.map(([command, callback]) => commands.registerCommand(`vscode-magit.${command}`, callback)));
};
