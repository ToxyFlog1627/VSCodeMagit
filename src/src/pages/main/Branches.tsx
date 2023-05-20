import { FunctionComponent } from 'react';
import Group from '../../components/Group';
import styled from 'styled-components';
import useFetch from '../../hooks/useFetch';

const Column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 3px;
`;

const BranchName = styled.p<{ color: string }>`
	font-weight: bold;
	color: var(--vscode-charts-${({ color }) => color});
`;

type Branch = {
	branch: string;
	commit: string;
};

const Branches: FunctionComponent = () => {
	const branches = useFetch<{ [key: string]: Branch }>('branches');

	if (!branches) return null;
	return (
		<Group title="Branches" section>
			<Column>
				<p>Local: </p>
				{branches.remote && <p>Remote: </p>}
			</Column>
			<Column>
				<BranchName color="orange">{branches.local.branch}</BranchName>
				{branches.remote && <BranchName color="green">{branches.remote.branch}</BranchName>}
			</Column>
			<Column>
				<p>{branches.local.commit}</p>
				{branches.remote && <p>{branches.remote.commit}</p>}
			</Column>
		</Group>
	);
};

export default Branches;
