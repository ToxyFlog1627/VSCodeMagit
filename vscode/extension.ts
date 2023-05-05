import { commands, ExtensionContext } from 'vscode';
import createEditor from './editor';

export let patchPath: string;

export const activate = (context: ExtensionContext) => {
	patchPath = context.storageUri!.fsPath;
	context.subscriptions.push(commands.registerCommand('vscode-magit.magit', createEditor(context)));
};
