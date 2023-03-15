import {FunctionComponent} from "react";
import styled from "styled-components";
import Group from "../components/Group";
import useFetch from "../hooks/useFetch";

const Column = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 2px;
`;

const Hash = styled.p`
	color: var(--vscode-disabledForeground);
`;

const Commits: FunctionComponent<{}> = ({}) => {
	const [commits] = useFetch<[string, string][]>("GET_COMMITS");
	if (commits === null) return null;

	return (
		<Group title="Recent commits" section>
			<Column>
				{commits.map(([hash]) => (
					<Hash>{hash}</Hash>
				))}
			</Column>
			<Column>
				{commits.map(([_, text]) => (
					<p>{text}</p>
				))}
			</Column>
		</Group>
	);
};

export default Commits;
