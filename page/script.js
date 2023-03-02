//* API
const vscode = acquireVsCodeApi(); // eslint-disable-line no-undef

const MESSAGE_TIMEOUT_SECONDS = 10;

let _id = 0;
const callbacks = {};

const request = (type, message) => {
	return new Promise(resolve => {
		const id = _id++;
		vscode.postMessage({id, type, message});

		const timeout = setTimeout(() => resolve({data: "Timeout!", error: true}), MESSAGE_TIMEOUT_SECONDS * 1000);
		callbacks[id] = (data, error) => {
			clearTimeout(timeout);
			if (error) resolve({data: error, error: true});
			else resolve({data, error: false});
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
//? Variables
let highlightedElement;
let untrackedFiles;
let unstagedChanges;
const stagedChanges = [
	["modified", "src/CMakeLists.txt"],
	["created", "src/something.cpp"],
];
const commits = [
	["689ead", "Test commit message"],
	["689ead", "Client created"],
	["689ead", "First commit"],
];
const localBranch = "master";
const remoteBranch = "origin/master";
const mergeBranch = "origin/master";

//? Rendering
const blue = text => `<span class="blue">${text}</span>`;
const green = text => `<span class="green">${text}</span>`;

const createFoldable = (title, content, additionalClasses = "") => {
	if (title)
		return `
        <div class="foldable ${additionalClasses}">
            <div class="row">
                <div class="chevron"></div>
                ${title.startsWith("<") ? title : `<div class="foldable-title">${title}</div>`}
            </div>
            <div class="row">
                <div class="chevron invisible"></div>
                <div class="foldable-content">
                    ${content}
                </div>
            </div>
        </div>`;
	else
		return `
        <div class="foldable-without-title ${additionalClasses}">
            <div class="chevron"></div>
            <div class="foldable-content">
                ${content}
            </div>
        </div>`;
};

const createColumn = (array, additionalClasses = "") => `<div class="column ${additionalClasses}">${array.reduce((result, current) => result + `<p>${current}</p>`, "")}</div>`;
const createRow = (...elements) => `<div class="row">${elements.reduce((result, current) => result + current, "")}</div>`;

const renderBranches = () => {
	const type = ["Head: ", "Merge: ", "Push: "];
	const messages = [`${blue(localBranch)} ${commits[0][1]}`, `${green(remoteBranch)} ${commits[0][1]}`, `${green(mergeBranch)} ${commits[0][1]}`];
	return createFoldable(null, createRow(createColumn(type), createColumn(messages)));
};
const renderUntrackedFiles = () => {
	if (untrackedFiles.length === 0) return "";
	return createFoldable("Untracked files", createColumn(untrackedFiles, "untracked"), "indent");
};
const renderUnstagedChanges = () => {
	if (unstagedChanges.length === 0) return "";
	return createFoldable(
		"Unstaged changes",
		createColumn(
			unstagedChanges.map(([action, file, content]) =>
				createFoldable(
					`${action} ${file}`,
					createColumn(
						content.map(hunk =>
							createFoldable(
								hunk[0],
								`<div class="column code">
                                    ${hunk.slice(1).reduce((result, line) => {
										if (line.charAt(0) === "+") return result + `<p class="green">${line.slice(1)}</p>`;
										if (line.charAt(0) === "-") return result + `<p class="red">${line.slice(1)}</p>`;
										return result + `<p>${line}</p>`;
									}, "")}
                                </div>`,
								"no-offset indent"
							)
						)
					),
					"folded"
				)
			)
		)
	);
};
const renderStagedChanges = () => {
	if (stagedChanges.length === 0) return "";
	return createFoldable("Staged changes", createRow(createColumn(stagedChanges.map(change => change[0])), createColumn(stagedChanges.map(change => change[1]))), "indent");
};
const renderCommits = () => {
	if (commits.length === 0) return "";
	return createFoldable(
		"Recent commits",
		createRow(
			createColumn(
				commits.map(change => change[0]),
				"hashes"
			),
			createColumn(commits.map(change => change[1]))
		),
		"indent"
	);
};

const showError = () => (document.body.innerHTML = `<div class="error-container"><p>An unexpected error has occurred!</p></div>`);

const render = async () => {
	let data, error;

	[data, error] = await request("GET_UNTRACKED_FILES");
	if (error) return showError();
	untrackedFiles = data;

	[data, error] = await request("GET_UNSTAGED_CHANGES");
	if (error) return showError();
	unstagedChanges = data;
	console.log(data, error);

	// [data, error] = await request("GET_STAGED_CHANGES");
	// if (error) return showError();
	// stagedChanges = data;

	// [data, error] = await request("GET_COMMITS");
	// if (error) return showError();
	// commits = data;

	document.body.innerHTML = `
        <div id="highlight"></div>
        ${renderBranches()}
        ${renderUntrackedFiles()}
        ${renderUnstagedChanges()}
        ${renderStagedChanges()}
        ${renderCommits()}
    `;

	[...document.querySelectorAll(".foldable, .foldable-without-title")].forEach(element => element?.children[0]?.addEventListener("click", () => element.classList.toggle("folded")));
	highlightElement(getSelectableElements()[0]);
};

render();

//? Highlight element
// TODO: fix getSelElements func
const getSelectableElements = () => [...document.querySelectorAll(".foldable-title, .foldable-content .column:first-child p")].sort((a, b) => a.offsetTop - b.offsetTop);

const highlightElement = element => {
	const highligh = document.querySelector("#highlight");
	highlightedElement = element;
	highligh.style.top = `${element.offsetTop}px`;
	highligh.style.height = `${element.offsetHeight}px`;
};

const moveHighlighUp = () => {
	const elements = getSelectableElements();
	for (let i = 1; i < elements.length; i++) {
		if (elements[i] === highlightedElement) {
			highlightElement(elements[i - 1]);
			return;
		}
	}
};

const moveHighlighDown = () => {
	const elements = getSelectableElements();
	for (let i = 0; i < elements.length - 1; i++) {
		if (elements[i] === highlightedElement) {
			highlightElement(elements[i + 1]);
			return;
		}
	}
};

//? Keypress events

const eventOnHighlighted = key => {
	// TODO: check what is highlighted and execute corresponding function
};

//* Listeners
window.addEventListener("click", event => {
	let closestElement;
	let minDistance = Number.POSITIVE_INFINITY;
	getSelectableElements().forEach(element => {
		const distance = Math.abs(element.offsetTop + element.offsetHeight / 2 - event.y);
		if (distance > minDistance) return;

		minDistance = distance;
		closestElement = element;
	});

	highlightElement(closestElement);
});

window.addEventListener("keypress", ({key}) => {
	if (key === "j") moveHighlighDown();
	else if (key === "k") moveHighlighUp();
	else eventOnHighlighted(key);
});

// TODO: color modified/deleted/created words
// TODO: hunk: keep spaces, split lines, instead of + and -, color line green/red
// TODO: only top-level folders should be unfolded
