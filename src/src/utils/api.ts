import { refresh } from '../hooks/useFetch';

type Callback = (data: any, error: boolean) => void;

const MESSAGE_TIMEOUT_SECONDS = 10;

let _id = 0;
const callbacks: { [key: number]: Callback } = {};

const vscode = (window as any).acquireVsCodeApi();
const request = (type: string, body: any = null): Promise<{ data: any; error: boolean }> => {
	return new Promise(resolve => {
		const id = _id++;
		vscode.postMessage({ id, type, body });

		const timeout = setTimeout(() => resolve({ data: null, error: true }), MESSAGE_TIMEOUT_SECONDS * 1000);
		callbacks[id] = (data: any, error: boolean) => {
			clearTimeout(timeout);
			if (error) resolve({ data, error: true });
			else resolve({ data, error: false });
		};
	});
};

window.addEventListener('message', async message => {
	const { id, data, type, error } = message.data;
	if (id === -1 && type === 'refresh') return refresh();
	if (!callbacks[id]) return;

	callbacks[id](data, error);
	delete callbacks[id];
});

export default request;
