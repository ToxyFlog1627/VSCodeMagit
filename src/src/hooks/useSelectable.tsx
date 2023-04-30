import {useEffect, useRef} from "react";

export type Keybindings = {[key: string]: () => any};
export type Element = {
	element: HTMLElement;
	keybindings: Keybindings;
};

let _id = 0;
const elementMap: {[id: number]: Element[]} = {};
export let elements: Element[] = [];

const findElement = (top: number): number => {
	if (elements.length === 0 || top < elements[0].element.getBoundingClientRect().top) return -1;

	let l = 0;
	let r = elements.length - 1;

	while (l < r) {
		const m = Math.ceil((l + r) / 2);
		if (top < elements[m].element.getBoundingClientRect().top) r = m - 1;
		else l = m;
	}

	return l;
};

export const getClosestElement = (y: number): number => {
	const i = findElement(y);
	if (i === -1) return -1;

	const dst1 = Math.abs(y - (elements[i].element.getBoundingClientRect().top + elements[i].element.getBoundingClientRect().height / 2));
	const dst2 = Math.abs(y - (elements[i + 1]?.element.getBoundingClientRect().top + elements[i + 1]?.element.getBoundingClientRect().height / 2));
	return dst2 < dst1 ? i + 1 : i;
};

const useSelectable = (globalKeybindings: Keybindings = {}) => {
	const id = useRef(_id++);
	const batch = useRef<Element[]>([]);

	const updateElementsArray = () => {
		const allElements = Object.values(elementMap).reduce((arr, cur) => [...arr, ...cur], []);
		elements = allElements.sort((a, b) => a.element.getBoundingClientRect().top - b.element.getBoundingClientRect().top);
	};

	useEffect(() => {
		return () => {
			delete elementMap[id.current];
			updateElementsArray();
		};
	}, []);

	useEffect(() => {
		elementMap[id.current] = batch.current;
		batch.current = [];
		updateElementsArray();
	});

	return (elementKeybindings: Keybindings) => (element: HTMLElement | null) => element && batch.current.push({keybindings: {...globalKeybindings, ...elementKeybindings}, element});
};

export default useSelectable;
