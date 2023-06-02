import { ReactNode } from 'react';
import styled from 'styled-components';

type LineProps = {
	children: ReactNode;
	selected?: boolean;
};

const getFirstChar = (children: ReactNode) => (typeof children === 'string' ? children[0] : ' ');

const getLineColor = ({ children }: LineProps): string => {
	if (getFirstChar(children) === '+') return 'var(--vscode-gitDecoration-addedResourceForeground)';
	if (getFirstChar(children) === '-') return 'var(--vscode-gitDecoration-deletedResourceForeground)';
	return 'inherit';
};

export const getLineBackground = ({ children, selected }: LineProps): string => {
	const hexOpacity = selected ? '78' : '20';
	if (getFirstChar(children) === '+') return `#00FF00${hexOpacity}`;
	if (getFirstChar(children) === '-') return `#FF0000${hexOpacity}`;
	return selected ? `#ffffff20` : 'transparent';
};

const TextLine = styled.p<LineProps>`
	white-space: pre;
	color: ${getLineColor};
	background: ${getLineBackground};
	width: 100%;
	padding: 1px;
`;

export default TextLine;
