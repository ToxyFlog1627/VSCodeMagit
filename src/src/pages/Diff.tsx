import { FunctionComponent } from 'react';
import styled from 'styled-components';
import useSelectable from '../hooks/useSelectable';
import useFetch from '../hooks/useFetch';
import TextLine from '../components/TextLine';
import useKeybindings from '../hooks/useKeybindings';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	background: var(--vscode-button-background);
	color: var(--vscode-editor-foreground);
`;

type Props = {
	hash: string;
	close: () => void;
};

const Diff: FunctionComponent<Props> = ({ hash, close }) => {
	// TODO: showing changes partially as diff can be 100K+ lines
	const selectable = useSelectable();
	const diff = useFetch<string>('diff', { value: hash });

	useKeybindings({ q: close });

	if (diff === null) return null;

	const lines = diff.split('\n');
	if (lines[0].length === 0) lines.shift();
	if (lines[lines.length - 1].length === 0) lines.pop();
	return (
		<Container>
			{lines.map(line => (
				<TextLine ref={selectable()}>{line}</TextLine>
			))}
		</Container>
	);
};

export default Diff;
