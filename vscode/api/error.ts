import { window } from 'vscode';

export const showError = async (message: string) => {
	window.showErrorMessage(message);
	return { data: null };
};
