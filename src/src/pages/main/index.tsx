import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Selection, { resetSelection } from '../../components/Selection';
import Branches from './Branches';
import Files from './Files';
import Commits from './Commits';
import Changes from './Changes';
import GlobalStyles from '../../utils/globalStyles';
import Diff from '../Diff';

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

const MainPage: FunctionComponent = () => {
	const [diffHash, setDiffHash] = useState<string | null>(null);

	useEffect(resetSelection);

	return (
		<Container>
			<GlobalStyles />
			<Selection />

			{diffHash ? (
				<Diff hash={diffHash} closeDiff={() => setDiffHash(null)} />
			) : (
				<>
					<Branches />
					<Files />
					<Changes stagedChanges={false} />
					<Changes stagedChanges={true} />
					<Commits showDiff={(hash: string) => setDiffHash(hash)} />
				</>
			)}
		</Container>
	);
};

export default MainPage;
