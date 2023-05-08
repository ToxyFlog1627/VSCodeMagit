import { FunctionComponent } from 'react';
import Selection from '../components/Selection';
import Branches from './Branches';
import Files from './Files';
import Commits from './Commits';
import styled from 'styled-components';
import Changes from './Changes';

const Container = styled.div`
	margin-left: 5px;
	overflow-x: hidden;
	color: var(--vscode-foreground);
`;

const Page: FunctionComponent = () => (
	<Container>
		<Selection />
		<Branches />
		<Files />
		<Changes stagedChanges={false} />
		<Changes stagedChanges={true} />
		<Commits />
	</Container>
);

export default Page;
