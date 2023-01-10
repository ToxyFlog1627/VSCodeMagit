//* API client
const vscode = acquireVsCodeApi(); // eslint-disable-line no-undef

const MESSAGE_TIMEOUT_SECONDS = 5;

let _id = 0;
const callbacks = {};

const postMessage = (type, message) => {
	return new Promise(resolve => {
		const id = _id++;
		vscode.postMessage({id, type, message});

		const timeout = setTimeout(() => resolve([null, "Timeout!"]), MESSAGE_TIMEOUT_SECONDS * 1000);
		callbacks[id] = (data, error) => {
			clearTimeout(timeout);
			if (error) resolve([null, error]);
			else resolve([data]);
		};
	});
};

window.addEventListener("message", async message => {
	const {id, data, error} = message.data;
	if (!callbacks[id]) return;

	callbacks[id](data, error);
	delete callbacks[id];
});

//* Main
const registerFoldable = element => element?.children[0]?.addEventListener("click", () => element.classList.toggle("folded"));

[...document.querySelectorAll(".foldable, .foldable-without-title")].forEach(registerFoldable);
