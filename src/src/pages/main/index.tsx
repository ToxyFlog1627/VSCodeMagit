import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Diff from '../Diff';
import Selection from '../../components/Selection';
import Files from './Files';
import Commits from './Commits';
import Changes from './Changes';
import GlobalStyles from '../../utils/globalStyles';
import CommitMessageEditor from '../CommitMessageEditor';
import useKeybindings from '../../hooks/useKeybindings';
import { elements, getClosestElement } from '../../hooks/useSelectable';
import { refresh } from '../../hooks/useFetch';
import Branches from './Branches';

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

type SectionsProps = { resetSelection: () => void };

const Sections: FunctionComponent<SectionsProps> = ({ resetSelection }) => {
	const [diffHash, setDiffHash] = useState<string | null>(null);
	const [isCommitEditorVisible, setIsCommitEditorVisible] = useState<boolean>(false);

	useKeybindings({ c: () => setIsCommitEditorVisible(true) });

	resetSelection();
	if (diffHash) return <Diff hash={diffHash} close={() => setDiffHash(null)} />;
	if (isCommitEditorVisible) return <CommitMessageEditor close={() => setIsCommitEditorVisible(false)} />;
	return (
		<>
			<Branches />
			<Files />
			<Changes stagedChanges={false} />
			<Changes stagedChanges={true} />
			<Commits showDiff={(hash: string) => setDiffHash(hash)} />
		</>
	);
};

const MainPage: FunctionComponent = () => {
	const [selectedIndex, setSelectedIndex] = useState(-1);

	useKeybindings({
		j: () => selectedIndex < elements.length - 1 && setSelectedIndex(selectedIndex + 1),
		k: () => selectedIndex > 0 && setSelectedIndex(selectedIndex - 1),
		g: () => setSelectedIndex(0),
		G: () => setSelectedIndex(elements.length - 1),
		r: refresh
	});

	const onClick = (event: MouseEvent) => setSelectedIndex(getClosestElement(event.clientY));

	useEffect(() => {
		window.addEventListener('click', onClick);
		return () => window.removeEventListener('click', onClick);
	});

	const sections = useMemo(() => <Sections resetSelection={() => setSelectedIndex(-1)} />, [setSelectedIndex]);

	return (
		<Container>
			<GlobalStyles />
			<Selection selectedIndex={selectedIndex} />
			{sections}
		</Container>
	);
};

export default MainPage;
