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
	REMOTE_POPUP
}

type SectionsProps = { resetSelection: () => void };

const Sections: FunctionComponent<SectionsProps> = ({ resetSelection }) => {
	const [window, setWindow] = useState<Window>(Window.DEFAULT);
	const [popup, setPopup] = useState<Popup>(Popup.NONE);
	const diffHash = useRef<string>('');

	useKeybindings({ c: () => setWindow(Window.COMMIT_MESSAGE_EDITOR), p: () => setPopup(Popup.PUSH_POPUP), r: () => setPopup(Popup.REMOTE_POPUP) });

	resetSelection();

	if (window === Window.DIFF) return <Diff hash={diffHash.current} close={() => setWindow(Window.DEFAULT)} />;
	if (window === Window.COMMIT_MESSAGE_EDITOR) return <CommitMessageEditor close={() => setWindow(Window.DEFAULT)} />;

	const showDiff = (hash: string) => {
		diffHash.current = hash;
		setWindow(Window.DIFF);
	};

	return (
		<>
			{popup === Popup.PUSH_POPUP && <PushPopup close={() => setPopup(Popup.NONE)} />}
			{popup === Popup.REMOTE_POPUP && <RemotePopup close={() => setPopup(Popup.NONE)} />}
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
