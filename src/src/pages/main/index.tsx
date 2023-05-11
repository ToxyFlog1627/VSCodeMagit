import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Selection from '../../components/Selection';
import Branches from './Branches';
import Files from './Files';
import Commits from './Commits';
import Changes from './Changes';
import GlobalStyles from '../../utils/globalStyles';

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

const MainPage: FunctionComponent = () => (
	<Container>
		<GlobalStyles />
		<Selection />

		<Branches />
		<Files />
		<Changes stagedChanges={false} />
		<Changes stagedChanges={true} />
		<Commits />
	</Container>
);

export default MainPage;
