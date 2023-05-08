import { FunctionComponent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Group from '../components/Group';
import useSelectable, { Keybindings } from '../hooks/useSelectable';
import useFetch, { updateSubscribed } from '../hooks/useFetch';
import { ErrorContext } from '../App';
import request from '../utils/api';

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

const HunkContainer = styled(Column)`
	background: var(--vscode-button-background);
`;

type LineProps = {
	children: string;
	selected: boolean;
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

const Line = styled.p<LineProps>`
	white-space: pre;
	color: ${getLineColor};
	background: ${getLineBackground};
	width: 100%;
	padding: 1px;
`;

const getFileChangeDescription = (from: string, to: string) => {
	if (to === '/dev/null') return `deleted ${from}`;
	if (from === '/dev/null') return `created ${to}`;
	if (from !== to) return `renamed ${from} -> ${to}`;
	return `modified ${to}`;
};

type Diff = {
	from: string;
	to: string;
	hunks: string[][];
}[];

type HunkProps = {
	file: string;
	lines: string[];
	getKeybindings: (action: () => void, keybindings: Keybindings) => Keybindings;
	rangeAction: (file: string, header: string, index: number, length: number) => void;
};

const Hunk: FunctionComponent<HunkProps> = ({ file, lines, getKeybindings, rangeAction }) => {
	const [selection, setSelection] = useState({ index: -1, offset: 0 });
	const selectable = useSelectable();

	const resetSelection = () => setSelection({ index: -1, offset: 0 });

	useEffect(() => {
		window.addEventListener('click', resetSelection);
		return () => window.removeEventListener('click', resetSelection);
	}, []);

	const lineAction = (index: number) => {
		if (selection.index === -1) {
			rangeAction(file, lines[0], index, 1);
			return;
		}

		const min = Math.min(selection.index, selection.index + selection.offset);
		const max = Math.max(selection.index, selection.index + selection.offset);
		rangeAction(file, lines[0], min, max - min + 1);
		resetSelection();
	};

	const toggleSelection = (index: number) => {
		if (selection.index === -1) setSelection({ index, offset: 0 });
		else resetSelection();
	};

	const isSelected = (index: number) =>
		selection.index === -1
			? false
			: Math.min(selection.index, selection.index + selection.offset) <= index && index <= Math.max(selection.index, selection.index + selection.offset);

	return (
		<HunkContainer>
			{lines.slice(1).map((line, i) => (
				<Line
					selected={isSelected(i)}
					ref={selectable(
						getKeybindings(() => lineAction(i), {
							' ': () => toggleSelection(i),
							Escape: () => resetSelection(),
							j: () => (i + 1 === lines.length ? resetSelection() : setSelection({ ...selection, offset: selection.offset + 1 })),
							k: () => (i === 0 ? resetSelection() : setSelection({ ...selection, offset: selection.offset - 1 })),
							g: resetSelection,
							G: resetSelection
						})
					)}
				>
					{line}
				</Line>
			))}
		</HunkContainer>
	);
};

type Props = { stagedChanges: boolean };

const Changes: FunctionComponent<Props> = ({ stagedChanges }) => {
	const selectable = useSelectable();
	const { setError } = useContext(ErrorContext);
	const diff = useFetch<Diff>(stagedChanges ? 'stagedChanges' : 'unstagedChanges');

	const stageAllFiles = async () => {
		const { error } = await request('stageAllFiles');
		if (error) return setError("Couldn't stage files!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageFile = async (file: string) => {
		const { error } = await request('stageFile', file);
		if (error) return setError("Couldn't stage file!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageHunk = async (file: string, header: string) => {
		const { error } = await request('stageHunk', { file, header });
		if (error) return setError("Couldn't stage hunk!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const stageRange = async (file: string, header: string, index: number, length: number) => {
		const { error } = await request('stageRange', { file, header, index, length });
		if (error) return setError("Couldn't stage range!");
		updateSubscribed('unstagedChanges');
		updateSubscribed('stagedChanges');
	};

	const unstageAllFiles = async () => {
		const { error } = await request('unstageAllFiles');
		if (error) return setError("Couldn't unstage files!");
		updateSubscribed('stagedChanges');
		updateSubscribed('untrackedFiles');
		updateSubscribed('unstagedChanges');
	};

	const unstageFile = async (file: string) => {
		const { error } = await request('unstageFile', file);
		if (error) return setError("Couldn't unstage file!");
		updateSubscribed('stagedChanges');
		updateSubscribed('untrackedFiles');
		updateSubscribed('unstagedChanges');
	};

	const unstageHunk = async (file: string, header: string) => {
		const { error } = await request('unstageHunk', { file, header });
		if (error) return setError("Couldn't unstage hunk!");
		updateSubscribed('stagedChanges');
		updateSubscribed('untrackedFiles');
		updateSubscribed('unstagedChanges');
	};

	const unstageRange = async (file: string, header: string, index: number, length: number) => {
		const { error } = await request('unstageRange', { file, header, index, length });
		if (error) return setError("Couldn't unstage range!");
		updateSubscribed('stagedChanges');
		updateSubscribed('untrackedFiles');
		updateSubscribed('unstagedChanges');
	};

	if (!diff || diff.length === 0) return null;

	const title = stagedChanges ? 'Staged changes' : 'Unstaged changes';
	const globalKey = stagedChanges ? 'U' : 'S';
	const key = stagedChanges ? 'u' : 's';
	const globalAction = stagedChanges ? unstageAllFiles : stageAllFiles;
	const fileAction = stagedChanges ? unstageFile : stageFile;
	const hunkAction = stagedChanges ? unstageHunk : stageHunk;
	const rangeAction = stagedChanges ? unstageRange : stageRange;

	const getKeybindings = (action: () => void, keybindings: Keybindings = {}) => ({ [globalKey]: globalAction, [key]: action, ...keybindings });

	return (
		<Group title={title} keybindings={getKeybindings(() => {})} section>
			<Column>
				{diff.map(({ from, to, hunks }) =>
					hunks.length === 0 ? (
						<p ref={selectable(getKeybindings(() => fileAction(to)))}>{getFileChangeDescription(from, to)}</p>
					) : (
						<Group title={getFileChangeDescription(from, to)} isOpened={false} keybindings={getKeybindings(() => fileAction(to))}>
							<TextContainer>
								{hunks.map(lines => (
									<Group title={lines[0]} keybindings={getKeybindings(() => hunkAction(to, lines[0]))}>
										<Hunk file={to} lines={lines} getKeybindings={getKeybindings} rangeAction={rangeAction} />
									</Group>
								))}
							</TextContainer>
						</Group>
					)
				)}
			</Column>
		</Group>
	);
};

export default Changes;
