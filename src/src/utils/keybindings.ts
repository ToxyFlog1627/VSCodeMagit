import {elementMap} from "../hooks/useSelectable";
import {Element} from "../hooks/useSelectable";

export const invokeKeybinding = ({element, keybindings}: Element, key: string) => {
	if (keybindings[key] && keybindings[key]()) return;

	let cur = element.parentElement;
	while (cur && cur !== document.body) {
		const id = Number(cur.getAttribute("element_id"));
		const index = Number(cur.getAttribute("element_index"));
		cur = cur.parentElement;

		if (!id || !index) continue;

		const keybindings = elementMap[id][index].keybindings;
		if (keybindings[key] && keybindings[key]) return;
	}
};
