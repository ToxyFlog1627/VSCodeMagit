import {useEffect, useRef} from "react";

type Keybindings = {[key: string]: () => boolean};
export type Element = {
	element: HTMLElement;
	boundingBox: DOMRect;
	keybindings: Keybindings;
};

let _id = 0;
export const elementMap: {[id: number]: Element[]} = {};
export let elements: Element[] = [];

const findElement = (top: number): number => {
	if (elements.length === 0 || top < elements[0].boundingBox.top) return -1;

	let l = 0;
	let r = elements.length - 1;

	while (l < r) {
		const m = Math.ceil((l + r) / 2);
		if (top < elements[m].boundingBox.top) r = m - 1;
		else l = m;
	}

	return l;
};

export const getClosestElement = (y: number): number => {
	const i = findElement(y);
	if (i === -1) return -1;

	const dst1 = Math.abs(y - (elements[i].boundingBox.top + elements[i].boundingBox.height / 2));
	const dst2 = Math.abs(y - (elements[i + 1]?.boundingBox.top + elements[i + 1]?.boundingBox.height / 2));
	return dst2 < dst1 ? i + 1 : i;
};

const useSelectable = () => {
	const id = useRef(_id++);
	const batch = useRef<Element[]>([]);

	const updateElementsArray = () => {
		const allElements = Object.values(elementMap).reduce((arr, cur) => [...arr, ...cur], []);
		elements = allElements.sort((a, b) => a.boundingBox.top - b.boundingBox.top);
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

	return (keybindings: Keybindings = {}, selectable = true) => {
		return (element: HTMLElement | null) => {
			if (!element) return;
			if (!selectable) {
				element.setAttribute("element_id", id.current.toString());
				element.setAttribute("element_index", batch.current.length.toString());
			}
			batch.current.push({keybindings, element, boundingBox: element.getBoundingClientRect()});
		};
	};
};

export default useSelectable;
