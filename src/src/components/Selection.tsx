import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { elements, getClosestElement } from '../hooks/useSelectable';
import { refresh } from '../hooks/useFetch';

const Block = styled.div<{ position: DOMRect }>`
	position: absolute;
	z-index: 999;
	top: ${props => props.position.top}px;
	left: ${props => props.position.left}px;
	width: 100%;
	height: ${props => props.position.height}px;
	background: var(--vscode-editor-selectionHighlightBackground);
	pointer-events: none;
`;

const Selection: FunctionComponent = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const onKeyPress = ({ key }: KeyboardEvent) => {
		switch (key) {
			case 'j':
				if (selectedIndex + 1 < elements.length) setSelectedIndex(selectedIndex + 1);
				break;
			case 'k':
				if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
				break;
			case 'r':
				refresh();
				break;
			default:
				if (elements[selectedIndex].keybindings[key]) elements[selectedIndex].keybindings[key]();
		}
	};

	const onClick = (event: MouseEvent) => setSelectedIndex(getClosestElement(event.clientY));

	useEffect(() => {
		window.addEventListener('keypress', onKeyPress);
		return () => window.removeEventListener('keypress', onKeyPress);
	});

	useEffect(() => {
		window.addEventListener('click', onClick);
		return () => window.removeEventListener('click', onClick);
	}, []);

	if (selectedIndex < 0 || selectedIndex >= elements.length) return null;
	return <Block position={elements[selectedIndex].element.getBoundingClientRect()} />;
};

export default Selection;
