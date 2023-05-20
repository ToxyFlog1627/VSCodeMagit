import { commands, ExtensionContext } from 'vscode';
import createWindow from './window';

export let patchPath: string;

export const activate = (context: ExtensionContext) => {
	patchPath = context.storageUri!.fsPath;
	context.subscriptions.push(commands.registerCommand('vscode-magit.magit', createWindow(context)));
};
