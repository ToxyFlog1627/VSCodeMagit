import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100vw;
	max-height: 20vh;
	padding: 6px 10px;
	background: var(--vscode-editorHoverWidget-background);
	overflow: hidden;
`;

type Props = {
	close: (value: boolean) => void;
	children: React.ReactNode;
};

const Popup: FunctionComponent<Props> = ({ close, children }) => {
	useEffect(() => {
		window.addEventListener('click', () => close(false));
		return () => window.removeEventListener('click', () => close(false));
	}, [close]);

	return <Container>{children}</Container>;
};

export default Popup;
