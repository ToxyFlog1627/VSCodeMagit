import styled from 'styled-components';

type LineProps = {
	children: string;
	selected?: boolean;
};

const getLineColor = ({ children }: LineProps): string => {
	if (children[0] === '+') return 'var(--vscode-gitDecoration-addedResourceForeground)';
	if (children[0] === '-') return 'var(--vscode-gitDecoration-deletedResourceForeground)';
	return 'inherit';
};

const getLineBackground = ({ children, selected }: LineProps): string => {
	const hexOpacity = selected ? '78' : '20';
	if (children[0] === '+') return `#00FF00${hexOpacity}`;
	if (children[0] === '-') return `#FF0000${hexOpacity}`;
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
