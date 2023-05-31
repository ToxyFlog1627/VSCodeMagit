import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useKeybindings from '../../hooks/useKeybindings';
import { elements, getClosestElement } from '../../hooks/useSelectable';
import { refresh } from '../../hooks/useFetch';
import GlobalStyles from '../../utils/globalStyles';
import Selection from '../../components/Selection';
import Branches from './Branches';
import Files from './Files';
import Changes from './Changes';
import Commits from './Commits';
import Diff from '../Diff';
import CommitMessageEditor from '../CommitMessageEditor';
import PushPopup from '../../components/popups/PushPopup';
import RemotePopup from '../../components/popups/RemotePopup';
import PullPopup from '../../components/popups/PullPopup';
import BranchPopup from '../../components/popups/BranchPopup';

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

enum Window {
	DEFAULT,
	DIFF,
	COMMIT_MESSAGE_EDITOR
}

enum Popup {
	NONE,
	PUSH_POPUP,
	PULL_POPUP,
	REMOTE_POPUP,
	BRANCH_POPUP
}

type SectionsProps = { resetSelection: () => void };

const Sections: FunctionComponent<SectionsProps> = ({ resetSelection }) => {
	const [window, setWindow] = useState<Window>(Window.DEFAULT);
	const [popup, setPopup] = useState<Popup>(Popup.NONE);
	const diffHash = useRef<string>('');

	useKeybindings({
		b: () => setPopup(Popup.BRANCH_POPUP),
		c: () => setWindow(Window.COMMIT_MESSAGE_EDITOR),
		p: () => setPopup(Popup.PUSH_POPUP),
		P: () => setPopup(Popup.PULL_POPUP),
		r: () => setPopup(Popup.REMOTE_POPUP)
	});

	resetSelection();

	if (window === Window.DIFF) return <Diff hash={diffHash.current} close={() => setWindow(Window.DEFAULT)} />;
	if (window === Window.COMMIT_MESSAGE_EDITOR) return <CommitMessageEditor close={() => setWindow(Window.DEFAULT)} />;

	const showDiff = (hash: string) => {
		diffHash.current = hash;
		setWindow(Window.DIFF);
	};

	const closePopup = () => setPopup(Popup.NONE);

	return (
		<>
			{popup === Popup.BRANCH_POPUP && <BranchPopup close={closePopup} />}
			{popup === Popup.PUSH_POPUP && <PushPopup close={closePopup} />}
			{popup === Popup.PULL_POPUP && <PullPopup close={closePopup} />}
			{popup === Popup.REMOTE_POPUP && <RemotePopup close={closePopup} />}
			<Branches />
			<Files />
			<Changes stagedChanges={false} />
			<Changes stagedChanges={true} />
			<Commits showDiff={showDiff} />
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
		r: refresh,
		' ': event => event.target === document.body && event.preventDefault()
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
