import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Group from '../../components/Group';
import useFetch from '../../hooks/useFetch';
import useSelectable from '../../hooks/useSelectable';

const Column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 2px;
`;

const Hash = styled.p`
	color: var(--vscode-disabledForeground);
`;

const Text = styled.p`
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

type HashesProps = Props & { hashes: string[] };

const Hashes: FunctionComponent<HashesProps> = ({ showDiff, hashes }) => {
	const selectable = useSelectable();

	return (
		<Column>
			{hashes.map(hash => (
				<Hash ref={selectable({ ' ': () => showDiff(hash), d: () => showDiff(hash) })}>{hash}</Hash>
			))}
		</Column>
	);
};

type Props = { showDiff: (hash: string) => void };

const Commits: FunctionComponent<Props> = props => {
	const commits = useFetch<[string, string][]>('commits');

	if (!commits) return null;
	return (
		<Group title="Recent commits" section>
			<Hashes hashes={commits.map(([hash]) => hash)} {...props} />
			<Column>
				{commits.map(([_, text]) => (
					<Text>{text.replaceAll('\n', ' ')}</Text>
				))}
			</Column>
		</Group>
	);
};

export default Commits;
