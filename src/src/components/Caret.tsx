import { FunctionComponent } from 'react';
import styled from 'styled-components';

const Arrow = styled.div<{ opened: boolean }>`
	position: absolute;
	top: 2px;
	left: -13px;
	width: 7px;
	height: 7px;
	background: transparent;
	border-top: 1px solid var(--vscode-editor-foreground);
	border-right: 1px solid var(--vscode-editor-foreground);
	cursor: pointer;
	transform: ${({ opened }) => (opened ? 'rotate(135deg)' : 'rotate(45deg) translateX(1px) translateY(3px)')};
`;

type Props = {
	opened: boolean;
	setOpened: (opened: boolean) => void;
};

const Caret: FunctionComponent<Props> = ({ opened, setOpened }) => <Arrow opened={opened} onClick={() => setOpened(!opened)} />;

export default Caret;
