//! make "src/" react project, that is built into page folder for usage with vscode
//! The only piece of code from there that is good-to-use:
//! Make hook out of it or leave as helper/api function
// TODO: react

// //* API
// const vscode = acquireVsCodeApi(); // eslint-disable-line no-undef

// const MESSAGE_TIMEOUT_SECONDS = 10;

// let _id = 0;
// const callbacks = {};

// const request = (type, message) => {
// 	return new Promise(resolve => {
// 		const id = _id++;
// 		vscode.postMessage({id, type, message});

// 		const timeout = setTimeout(() => resolve({data: "Timeout!", error: true}), MESSAGE_TIMEOUT_SECONDS * 1000);
// 		callbacks[id] = (data, error) => {
// 			clearTimeout(timeout);
// 			if (error) resolve({data: error, error: true});
// 			else resolve({data, error: false});
// 		};
// 	});
// };

// window.addEventListener("message", async message => {
// 	const {id, data, error} = message.data;
// 	if (!callbacks[id]) return;

// 	callbacks[id](data, error);
// 	delete callbacks[id];
// });
