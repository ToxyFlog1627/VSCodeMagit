import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Group from '../components/Group';
import useSelectable from '../hooks/useSelectable';

const Column = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const TextContainer = styled(Column)`
	background: var(--vscode-button-hoverBackground);
	color: var(--vscode-editor-foreground);
	width: 100vw;
	border: none;
	border-radius: 2px;
`;

const Hunk = styled(Column)`
	background: var(--vscode-button-background);
`;

const Line = styled.p<{ children: string }>`
	white-space: pre;
	color: ${({ children }) =>
		children[0] === '+' ? 'var(--vscode-gitDecoration-addedResourceForeground)' : children[0] === '-' ? 'var(--vscode-gitDecoration-deletedResourceForeground)' : 'inherit'};
	background: ${({ children }) => (children[0] === '+' ? '#00FF0020' : children[0] === '-' ? '#FF000020' : '#00000000')};
	width: 100%;
	padding: 1px;
`;

const getFileChangeDescription = (from: string, to: string) => {
	if (to === '/dev/null') return `deleted ${from}`;
	if (from === '/dev/null') return `created ${to}`;
	if (from !== to) return `renamed ${from} -> ${to}`;
	return `modified ${to}`;
};

export type Diff = {
	from: string;
	to: string;
	hunks: string[][];
}[];

type Props = {
	title: string;
	diff: Diff;
	globalKey: string;
	globalAction: () => void;
	actionKey: string;
	fileAction: (file: string) => void;
	hunkAction: (file: string, from: string, to: string, hunk: string[]) => void;
	rangeAction: (file: string, hunk: string[], from: number, length: number) => void;
};

const Changes: FunctionComponent<Props> = ({ title, diff, globalKey, globalAction, actionKey, fileAction, hunkAction, rangeAction }) => {
	// TODO: selecting range + actions on it
	const selectable = useSelectable();

	const getKeybindings = (action: () => void) => ({ [globalKey]: globalAction, [actionKey]: action });

	return (
		<Group title={title} section>
			<Column>
				{diff.map(({ from, to, hunks }) => {
					const fileKeybindings = getKeybindings(() => fileAction(to));
					if (hunks.length === 0) return <p ref={selectable(fileKeybindings)}>{getFileChangeDescription(from, to)}</p>;
					return (
						<Group title={getFileChangeDescription(from, to)} isOpened={false} keybindings={fileKeybindings}>
							<TextContainer>
								{hunks.map(lines => (
									<Group title={lines[0]} keybindings={getKeybindings(() => hunkAction(to, from, to, lines))}>
										<Hunk>
											{lines.slice(1, -1).map((line, i) => (
												<Line ref={selectable(getKeybindings(() => rangeAction(to, lines, i, 1)))}>{line}</Line>
											))}
										</Hunk>
									</Group>
								))}
							</TextContainer>
						</Group>
					);
				})}
			</Column>
		</Group>
	);
};

export default Changes;
