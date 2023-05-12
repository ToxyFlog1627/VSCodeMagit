import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { elements, getClosestElement } from '../hooks/useSelectable';
import { refresh } from '../hooks/useFetch';

const Block = styled.div<{ position: DOMRect }>`
	position: absolute;
	z-index: 999;
	top: ${props => window.scrollY + props.position.top}px;
	left: ${props => props.position.left}px;
	width: calc(100% - ${props => props.position.left}px);
	height: ${props => props.position.height}px;
	background: var(--vscode-editor-selectionHighlightBackground);
	pointer-events: none;
`;

export let resetSelection = () => {};

const Selection: FunctionComponent = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const elementRef = useRef(null);

	const onKeyPress = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'j':
				setSelectedIndex(Math.min(selectedIndex + 1, elements.length - 1));
				break;
			case 'k':
				setSelectedIndex(Math.max(selectedIndex - 1, 0));
				break;
			case 'r':
				refresh();
				break;
			case 'g':
				setSelectedIndex(0);
				break;
			case 'G':
				setSelectedIndex(elements.length - 1);
				break;
			case ' ':
				if (event.target === document.body) event.preventDefault();
				break;
		}

		if (selectedIndex < 0 || !elements[selectedIndex].keybindings[event.key]) return;
		elements[selectedIndex].keybindings[event.key]();
	};

	const onClick = (event: MouseEvent) => setSelectedIndex(getClosestElement(event.clientY));

	resetSelection = () => setSelectedIndex(-1);

	useEffect(() => {
		window.addEventListener('keypress', onKeyPress);
		return () => window.removeEventListener('keypress', onKeyPress);
	});

	useEffect(() => {
		if (!elementRef.current) return;
		const element = elementRef.current as HTMLElement;
		element.scrollIntoView({ block: 'nearest' });
	}, [selectedIndex]);

	useEffect(() => {
		window.addEventListener('click', onClick);
		return () => window.removeEventListener('click', onClick);
	}, []);

	if (selectedIndex === -1 || selectedIndex >= elements.length) return null;
	return <Block position={elements[selectedIndex].element.getBoundingClientRect()} ref={elementRef} />;
};

export default Selection;
