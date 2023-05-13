import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import useFetch from '../hooks/useFetch';
import TextLine from '../components/TextLine';
import useKeybindings from '../hooks/useKeybindings';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	background: var(--vscode-button-background);
	color: var(--vscode-editor-foreground);
`;

type Props = { close: () => void };

const CommitMessageEditor: FunctionComponent<Props> = ({ close }) => {
	const commitMessageTemplate = useFetch<string>('commitMessageTemplate', { disableAutoRefetch: true });
	const [commitMessage, setCommitMessage] = useState<string | null>(null);

	useEffect(() => setCommitMessage(commitMessageTemplate), [commitMessageTemplate]);

	useKeybindings({ q: close });

	if (commitMessage === null) return null;

	const lines = commitMessage.split('\n');
	return (
		<Container>
			{lines.map(line => (
				<TextLine onChange={e => console.log((e.target as HTMLInputElement).value, (e.target as HTMLElement).innerText)} contentEditable>
					{line}
				</TextLine>
			))}
		</Container>
	);
};

export default CommitMessageEditor;
