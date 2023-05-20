import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import useFetch from '../hooks/useFetch';
import useKeybindings from '../hooks/useKeybindings';
import TextLine, { getLineBackground } from '../components/TextLine';
import request from '../utils/api';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	background: var(--vscode-button-background);
	color: var(--vscode-editor-foreground);
`;

const EditableTextLine = styled(TextLine).attrs(_ => ({ contentEditable: true }))`
	outline: none;

	&:hover,
	&:focus {
		filter: brightness(1.1);
	}

	&:focus {
		background: ${({ children }) => getLineBackground({ children, selected: true })};
	}
`;

type Props = { close: () => void };

const CommitMessageEditor: FunctionComponent<Props> = ({ close }) => {
	const commitMessageTemplate = useFetch<string>('commitMessageTemplate', { disableAutoRefetch: true });
	const [commitMessage, setCommitMessage] = useState<string | null>(null);

	useEffect(() => setCommitMessage(commitMessageTemplate), [commitMessageTemplate]);

	const sendChanges = async () => {
		const commitMessage = lines.join('\n');
		const { error } = await request('commitMessage', commitMessage);
		if (error) return request('showError', "Couldn't commit message!");
		close();
	};

	useKeybindings({
		q: close,
		c: sendChanges,
		Escape: () => {
			console.log(document.activeElement);
			(document.activeElement as HTMLElement | null)?.blur();
		}
	});

	if (commitMessage === null) return null;

	const lines = commitMessage.split('\n');
	return (
		<Container>
			{lines.map((line, i) => (
				<EditableTextLine onInput={e => (lines[i] = (e.target as HTMLElement).innerText)}>{line}</EditableTextLine>
			))}
		</Container>
	);
};

export default CommitMessageEditor;
