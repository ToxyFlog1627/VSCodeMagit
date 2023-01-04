import {workspace, Disposable, TextDocumentContentProvider, ProviderResult, EventEmitter} from "vscode";

class MagitEditor implements TextDocumentContentProvider {
	static register = (): Disposable => workspace.registerTextDocumentContentProvider("magit", new MagitEditor());

	onDidChangeEmitter = new EventEmitter<void>();
	onDidChange = this.onDidChangeEmitter.event as any;
	// this.onDidChange(() => console.log("change"));
	// this.onDidChangeEmitter.fire();

	provideTextDocumentContent(): ProviderResult<string> {
		return "test";
	}
}

export default MagitEditor;
