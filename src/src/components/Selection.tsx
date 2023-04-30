import {FunctionComponent, useEffect, useState} from "react";
import styled from "styled-components";
import {elements, getClosestElement} from "../hooks/useSelectable";
import {invokeKeybinding} from "../utils/keybindings";

const Block = styled.div<{position: DOMRect}>`
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

	const onKeyPress = (event: KeyboardEvent) => {
		switch (event.key) {
			case "j":
				if (selectedIndex + 1 < elements.length) setSelectedIndex(selectedIndex + 1);
				break;
			case "k":
				if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
				break;
			default:
				invokeKeybinding(elements[selectedIndex], event.key);
		}
	};

	const onClick = (event: MouseEvent) => setSelectedIndex(getClosestElement(event.clientY));

	useEffect(() => {
		window.addEventListener("keypress", onKeyPress);
		return () => window.removeEventListener("keypress", onKeyPress);
	});

	useEffect(() => {
		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, []);

	if (selectedIndex < 0 || selectedIndex >= elements.length) return null;
	return <Block position={elements[selectedIndex].boundingBox} />;
};

export default Selection;
