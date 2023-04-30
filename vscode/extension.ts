import {commands, ExtensionContext} from "vscode";
import createEditor from "./editor";

export const activate = (context: ExtensionContext) => context.subscriptions.push(commands.registerCommand("vscode-magit.magit", createEditor(context)));

// TODO: add button on the left side?
