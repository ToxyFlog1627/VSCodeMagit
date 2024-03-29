import { FunctionComponent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { elements } from '../hooks/useSelectable';
import useKeybindings from '../hooks/useKeybindings';

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

type Props = { selectedIndex: number };

const Selection: FunctionComponent<Props> = ({ selectedIndex }) => {
	const elementRef = useRef(null);

	const onKey = (event: KeyboardEvent) => {
		if (selectedIndex < 0 || !elements[selectedIndex].keybindings[event.key]) return false;
		elements[selectedIndex].keybindings[event.key](event);
		return !elements[selectedIndex].passthrough;
	};

	useKeybindings(onKey, 5);

	useEffect(() => {
		if (!elementRef.current) return;
		const element = elementRef.current as HTMLElement;
		element.scrollIntoView({ block: 'nearest' });
	}, [selectedIndex]);

	if (selectedIndex === -1 || selectedIndex >= elements.length) return null;
	return <Block position={elements[selectedIndex].element.getBoundingClientRect()} ref={elementRef} />;
};

export default Selection;
